import { Injectable } from '@nestjs/common';

interface StoredOtp {
  code: string;
  expiresAt: number;
}

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Holds OTP codes in memory, keyed by phone number.
 *
 * This is fine for local development and a single server instance, but
 * won't survive a server restart and won't work once you're running more
 * than one backend instance (e.g. behind a load balancer). Before
 * production, swap this for Redis (or a `otp_codes` Postgres table with a
 * cron cleanup) — the interface below is deliberately small so that swap
 * only touches this one file.
 */
@Injectable()
export class OtpStoreService {
  private store = new Map<string, StoredOtp>();

  set(phone: string, code: string): void {
    this.store.set(phone, { code, expiresAt: Date.now() + OTP_TTL_MS });
  }

  /** Checks the code and, if valid, consumes it so it can't be reused. */
  verify(phone: string, code: string): boolean {
    const entry = this.store.get(phone);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(phone);
      return false;
    }
    const matches = entry.code === code;
    if (matches) this.store.delete(phone);
    return matches;
  }
}
