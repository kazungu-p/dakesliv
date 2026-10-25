import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

/**
 * Sends transactional email over plain SMTP, so it works with any provider
 * (Resend, Brevo, SendGrid, Postmark, Amazon SES, Zoho, Google Workspace...)
 * just by changing the SMTP_* values in .env — no provider-specific SDK.
 *
 * It can deliver TO any mailbox (iCloud, Gmail, Outlook...) — SMTP_* is
 * about who sends, not who receives.
 */
@Injectable()
export class MailService {
  // Lazily created for the same reason the payment/Odoo clients are: missing
  // config should fail the one request that needs it, not crash app startup.
  private transporter: Transporter | null = null;

  private getTransporter(): Transporter {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      throw new Error('Email isn\'t configured — set SMTP_HOST, SMTP_USER, SMTP_PASS and MAIL_FROM in .env.');
    }
    if (!this.transporter) {
      const port = Number(SMTP_PORT) || 587;
      this.transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port,
        secure: port === 465, // 465 = implicit TLS; 587 upgrades via STARTTLS
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });
    }
    return this.transporter;
  }

  async sendOtp(to: string, code: string): Promise<void> {
    const from = process.env.MAIL_FROM || process.env.SMTP_USER;
    await this.getTransporter().sendMail({
      from,
      to,
      subject: `${code} is your DAKESLIV verification code`,
      text: `Your DAKESLIV verification code is ${code}.\n\nIt expires in 5 minutes. If you didn't ask for this, you can ignore this email.`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:420px;margin:auto;padding:24px">
          <p style="margin:0 0 12px">Your DAKESLIV verification code is:</p>
          <p style="font-size:32px;letter-spacing:6px;font-weight:bold;margin:0 0 16px">${code}</p>
          <p style="color:#666;font-size:13px;margin:0">It expires in 5 minutes. If you didn't ask for this, you can ignore this email.</p>
        </div>`,
    });
  }
}
