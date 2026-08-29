import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import africastalking from 'africastalking';
import { User } from './user.entity';
import { OtpStoreService } from './otp-store.service';

export enum OtpChannel {
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  EMAIL = 'email',
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  // Lazily created — see getClient() below. Creating this eagerly (e.g. as
  // a field initializer) would call the SDK's own validation the instant
  // NestJS builds this class, which crashes the *entire application* on
  // startup if the credentials are missing or wrong, rather than failing
  // just the one request that actually needs them.
  private client: ReturnType<typeof africastalking> | null = null;

  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly otpStore: OtpStoreService,
    private readonly jwt: JwtService,
  ) {}

  /**
   * Customer sign-in: a code sent via SMS, WhatsApp, or email — no password.
   *
   * Channel is picked automatically unless the client requests one:
   *  - Kenyan numbers (+254) default to SMS — cheap, instant, reliable locally.
   *  - Every other country code defaults to WhatsApp — diaspora clients
   *    mostly already use it, and international SMS is both costlier and
   *    far less reliable to deliver than a Kenyan-focused SMS provider like
   *    Africa's Talking is built for.
   *  - `email` is always available as a manual fallback (not yet wired —
   *    see the TODO below).
   *
   * This is deliberately separate from staff/admin login — staff accounts
   * touch client data and payments, so they use proper email+password
   * credentials with 2FA instead (see the note in AuthModule).
   */
  async requestOtp(phone: string, preferredChannel?: OtpChannel): Promise<{ sent: true; channel: OtpChannel }> {
    const channel = preferredChannel ?? this.defaultChannelFor(phone);
    const code = this.generateCode();
    this.otpStore.set(phone, code);

    // Dev-only convenience: outside production, the code is always logged
    // here and delivery failures don't block the request. This means you
    // can test the full sign-in flow locally without Africa's Talking,
    // WhatsApp, or email working at all — just watch this terminal. This
    // NEVER runs in production (gated on NODE_ENV), so a real delivery
    // failure still fails loudly for real users, as it should.
    const isDev = process.env.NODE_ENV !== 'production';

    try {
      switch (channel) {
        case OtpChannel.SMS:
          await this.sendSms(phone, code);
          break;
        case OtpChannel.WHATSAPP:
          await this.sendWhatsApp(phone, code);
          break;
        case OtpChannel.EMAIL:
          // TODO: wire up Resend/SendGrid here.
          this.logger.warn(`Email OTP requested for ${phone} but email sending isn't wired up yet.`);
          break;
      }
    } catch (err) {
      if (!isDev) throw err;
      this.logger.warn(
        `[DEV ONLY] Couldn't actually deliver the OTP to ${phone} (${(err as Error).message}) — ` +
          `continuing anyway since NODE_ENV isn't 'production'. Use the code below to sign in.`,
      );
    }

    if (isDev) {
      this.logger.log(`[DEV ONLY] OTP code for ${phone}: ${code}`);
    }

    return { sent: true, channel };
  }

  async verifyOtp(phone: string, code: string): Promise<{ user: User; accessToken: string }> {
    const valid = this.otpStore.verify(phone, code);
    if (!valid) {
      throw new UnauthorizedException('That code is incorrect or has expired.');
    }

    let user = await this.users.findOneBy({ phone });
    if (!user) {
      user = this.users.create({ phone, name: 'New customer' });
      await this.users.save(user);
    }

    const accessToken = await this.jwt.signAsync({ sub: user.id, phone: user.phone });
    return { user, accessToken };
  }

  private getClient() {
    if (!process.env.AFRICAS_TALKING_API_KEY || !process.env.AFRICAS_TALKING_USERNAME) {
      throw new Error(
        "Africa's Talking isn't configured — set AFRICAS_TALKING_API_KEY and AFRICAS_TALKING_USERNAME in .env.",
      );
    }
    if (!this.client) {
      this.client = africastalking({
        apiKey: process.env.AFRICAS_TALKING_API_KEY,
        username: process.env.AFRICAS_TALKING_USERNAME,
      });
    }
    return this.client;
  }

  private defaultChannelFor(phone: string): OtpChannel {
    return phone.startsWith('+254') ? OtpChannel.SMS : OtpChannel.WHATSAPP;
  }

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
  }

  private async sendSms(phone: string, code: string): Promise<void> {
    const sms = this.getClient().SMS;
    await sms.send({
      to: [phone],
      message: `Your DAKESLIV verification code is ${code}. It expires in 5 minutes.`,
    });
  }

  private async sendWhatsApp(phone: string, code: string): Promise<void> {
    // Africa's Talking's WhatsApp product needs a registered WhatsApp
    // business number (separate from your SMS sender ID) — see
    // AFRICAS_TALKING_WA_NUMBER in .env.example.
    const whatsapp = this.getClient().WHATSAPP;
    await whatsapp.sendMessage({
      waNumber: process.env.AFRICAS_TALKING_WA_NUMBER,
      phoneNumber: phone,
      body: {
        message: `Your DAKESLIV verification code is ${code}. It expires in 5 minutes.`,
      },
    });
  }
}
