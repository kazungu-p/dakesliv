"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpStoreService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 30 * 1000;
const MAX_ATTEMPTS = 5;
let OtpStoreService = class OtpStoreService {
    constructor() {
        this.store = new Map();
    }
    secondsUntilResend(key) {
        const entry = this.store.get(key);
        if (!entry)
            return 0;
        const remaining = entry.sentAt + RESEND_COOLDOWN_MS - Date.now();
        return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
    }
    set(key, code) {
        const now = Date.now();
        this.store.set(key, { code, sentAt: now, expiresAt: now + OTP_TTL_MS, attempts: 0 });
    }
    verify(key, code) {
        const entry = this.store.get(key);
        if (!entry)
            return false;
        if (Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return false;
        }
        entry.attempts += 1;
        const a = Buffer.from(entry.code);
        const b = Buffer.from(code);
        const matches = a.length === b.length && (0, crypto_1.timingSafeEqual)(a, b);
        if (matches) {
            this.store.delete(key);
            return true;
        }
        if (entry.attempts >= MAX_ATTEMPTS)
            this.store.delete(key);
        return false;
    }
};
exports.OtpStoreService = OtpStoreService;
exports.OtpStoreService = OtpStoreService = __decorate([
    (0, common_1.Injectable)()
], OtpStoreService);
//# sourceMappingURL=otp-store.service.js.map