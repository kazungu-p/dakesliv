import { Injectable } from '@nestjs/common';
import { timingSafeEqual } from 'crypto';

interface StoredOtp {
  code: string;
  expiresAt: number;
  sentAt: number;
  attempts: number;
}

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const RESEND_COOLDOWN_MS = 30 * 1000; // stops someone using us to spam an inbox
const MAX_ATTEMPTS = 5; // a 6-digit code must not be brute-forceable

/**
 * Holds email OTP codes in memory, keyed by (lower-cased) email address.
 *
 * Fine for local development and a single server instance, but won't
 * survive a restart or work behind a load balancer with several instances.
 * Before scaling out, swap this for Redis (or an `otp_codes` Postgres
 * table) — the interface is deliberately small so only this file changes.
 */
@Injectable()
export class OtpStoreService {
  private store = new Map<string, StoredOtp>();

  /** Seconds the caller must still wait before requesting another code. */
  secondsUntilResend(key: string): number {
    const entry = this.store.get(key);
    if (!entry) return 0;
    const remaining = entry.sentAt + RESEND_COOLDOWN_MS - Date.now();
    return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
  }

  set(key: string, code: string): void {
    const now = Date.now();
    this.store.set(key, { code, sentAt: now, expiresAt: now + OTP_TTL_MS, attempts: 0 });
  }

  /** Checks the code and, if valid, consumes it so it can't be reused. */
  verify(key: string, code: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return false;
    }

    entry.attempts += 1;
    const a = Buffer.from(entry.code);
    const b = Buffer.from(code);
    const matches = a.length === b.length && timingSafeEqual(a, b);

    if (matches) {
      this.store.delete(key);
      return true;
    }
    if (entry.attempts >= MAX_ATTEMPTS) this.store.delete(key); // must request a new code
    return false;
  }
}
