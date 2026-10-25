import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { randomInt } from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { User } from './user.entity';
import { OtpStoreService } from './otp-store.service';
import { MailService } from './mail.service';

export interface AuthResult {
  user: User;
  accessToken: string;
}

/**
 * Customer sign-in. Two ways in, no passwords, no SMS:
 *
 *  1. Google — the client gets a Google ID token and sends it to
 *     signInWithGoogle(), which verifies it with Google's public keys.
 *  2. Email code — a 6-digit code emailed to any address (iCloud, Gmail,
 *     Outlook, work email...) via requestEmailOtp() / verifyEmailOtp().
 *
 * Both end up at the same place: one `users` row per person, matched by
 * email, and the same customer JWT. Signing in with Google and later with
 * an emailed code to the same address lands on the same account.
 *
 * Staff/admin login is separate (email + password, see StaffAuthService).
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private googleClient: OAuth2Client | null = null;

  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly otpStore: OtpStoreService,
    private readonly mail: MailService,
    private readonly jwt: JwtService,
  ) {}

  // ───────────────────────── Email code ─────────────────────────

  async requestEmailOtp(rawEmail: string): Promise<{ sent: true }> {
    const email = this.normalizeEmail(rawEmail);

    const wait = this.otpStore.secondsUntilResend(email);
    if (wait > 0) {
      throw new HttpException(
        `Please wait ${wait}s before requesting another code.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const code = this.generateCode();
    this.otpStore.set(email, code);

    // Dev-only convenience: outside production the code is always logged and
    // delivery failures don't block the request, so you can test the whole
    // flow without SMTP configured. Never runs in production — a real
    // delivery failure must fail loudly for real users.
    const isDev = process.env.NODE_ENV !== 'production';

    try {
      await this.mail.sendOtp(email, code);
    } catch (err) {
      if (!isDev) {
        this.logger.error(`Failed to email OTP to ${email}`, err as Error);
        throw err;
      }
      this.logger.warn(
        `[DEV ONLY] Couldn't email the OTP to ${email} (${(err as Error).message}) — ` +
          `continuing since NODE_ENV isn't 'production'. Use the code below to sign in.`,
      );
    }

    if (isDev) {
      this.logger.log(`[DEV ONLY] OTP code for ${email}: ${code}`);
    }

    return { sent: true };
  }

  async verifyEmailOtp(rawEmail: string, code: string, name?: string): Promise<AuthResult> {
    const email = this.normalizeEmail(rawEmail);
    if (!this.otpStore.verify(email, code)) {
      throw new UnauthorizedException('That code is incorrect or has expired.');
    }

    // Receiving the code proves they own this mailbox, so it's safe to
    // match (or create) the account purely by email.
    let user = await this.users.findOneBy({ email });
    if (!user) {
      user = await this.users.save(
        this.users.create({ email, name: name?.trim() || email.split('@')[0] }),
      );
    }
    return this.issueSession(user);
  }

  // ───────────────────────── Google ─────────────────────────

  async signInWithGoogle(idToken: string): Promise<AuthResult> {
    const audiences = (process.env.GOOGLE_CLIENT_IDS ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (audiences.length === 0) {
      throw new Error('Google sign-in isn\'t configured — set GOOGLE_CLIENT_IDS in .env.');
    }

    if (!this.googleClient) this.googleClient = new OAuth2Client();

    let payload;
    try {
      // Checks the signature against Google's keys, the expiry, the issuer,
      // and that the token was minted for OUR app (audience) — the last one
      // is what stops a token issued to some other app being replayed here.
      const ticket = await this.googleClient.verifyIdToken({ idToken, audience: audiences });
      payload = ticket.getPayload();
    } catch {
      throw new UnauthorizedException('Google sign-in failed. Please try again.');
    }

    if (!payload?.sub || !payload.email) {
      throw new UnauthorizedException('Google sign-in failed. Please try again.');
    }
    // Only trust the email to link accounts if Google has verified it.
    if (!payload.email_verified) {
      throw new UnauthorizedException('Your Google email address isn\'t verified.');
    }

    const googleId = payload.sub;
    const email = this.normalizeEmail(payload.email);

    let user = await this.users.findOneBy({ googleId });
    if (!user) {
      // First Google sign-in for this person: attach to an existing account
      // with the same (verified) email — e.g. they signed in by emailed code
      // before — or create a new one.
      user = await this.users.findOneBy({ email });
      if (user) {
        user.googleId = googleId;
        await this.users.save(user);
      } else {
        user = await this.users.save(
          this.users.create({ googleId, email, name: payload.name?.trim() || email.split('@')[0] }),
        );
      }
    }
    return this.issueSession(user);
  }

  // ───────────────────────── Profile ─────────────────────────

  findById(id: string): Promise<User> {
    return this.users.findOneByOrFail({ id });
  }

  async updateProfile(id: string, changes: { name?: string; phone?: string }): Promise<User> {
    const user = await this.users.findOneByOrFail({ id });

    if (changes.phone && changes.phone !== user.phone) {
      const taken = await this.users.findOneBy({ phone: changes.phone });
      if (taken && taken.id !== user.id) {
        throw new ConflictException('That phone number is already linked to another account.');
      }
      user.phone = changes.phone;
    }
    if (changes.name !== undefined) {
      const name = changes.name.trim();
      if (!name) throw new BadRequestException('Name can\'t be empty.');
      user.name = name;
    }
    return this.users.save(user);
  }

  // ───────────────────────── Helpers ─────────────────────────

  private async issueSession(user: User): Promise<AuthResult> {
    const accessToken = await this.jwt.signAsync({ sub: user.id, email: user.email, type: 'customer' });
    return { user, accessToken };
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  // crypto.randomInt is cryptographically secure; Math.random is predictable
  // and shouldn't be used for anything that gates account access.
  private generateCode(): string {
    return randomInt(100000, 1000000).toString(); // 6 digits
  }
}
