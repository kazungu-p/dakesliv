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
const OTP_TTL_MS = 5 * 60 * 1000;
let OtpStoreService = class OtpStoreService {
    constructor() {
        this.store = new Map();
    }
    set(phone, code) {
        this.store.set(phone, { code, expiresAt: Date.now() + OTP_TTL_MS });
    }
    verify(phone, code) {
        const entry = this.store.get(phone);
        if (!entry)
            return false;
        if (Date.now() > entry.expiresAt) {
            this.store.delete(phone);
            return false;
        }
        const matches = entry.code === code;
        if (matches)
            this.store.delete(phone);
        return matches;
    }
};
exports.OtpStoreService = OtpStoreService;
exports.OtpStoreService = OtpStoreService = __decorate([
    (0, common_1.Injectable)()
], OtpStoreService);
//# sourceMappingURL=otp-store.service.js.map