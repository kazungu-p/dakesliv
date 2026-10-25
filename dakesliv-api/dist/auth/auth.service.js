"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const crypto_1 = require("crypto");
const google_auth_library_1 = require("google-auth-library");
const user_entity_1 = require("./user.entity");
const otp_store_service_1 = require("./otp-store.service");
const mail_service_1 = require("./mail.service");
let AuthService = AuthService_1 = class AuthService {
    constructor(users, otpStore, mail, jwt) {
        this.users = users;
        this.otpStore = otpStore;
        this.mail = mail;
        this.jwt = jwt;
        this.logger = new common_1.Logger(AuthService_1.name);
        this.googleClient = null;
    }
    async requestEmailOtp(rawEmail) {
        const email = this.normalizeEmail(rawEmail);
        const wait = this.otpStore.secondsUntilResend(email);
        if (wait > 0) {
            throw new common_1.HttpException(`Please wait ${wait}s before requesting another code.`, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        const code = this.generateCode();
        this.otpStore.set(email, code);
        const isDev = process.env.NODE_ENV !== 'production';
        try {
            await this.mail.sendOtp(email, code);
        }
        catch (err) {
            if (!isDev) {
                this.logger.error(`Failed to email OTP to ${email}`, err);
                throw err;
            }
            this.logger.warn(`[DEV ONLY] Couldn't email the OTP to ${email} (${err.message}) — ` +
                `continuing since NODE_ENV isn't 'production'. Use the code below to sign in.`);
        }
        if (isDev) {
            this.logger.log(`[DEV ONLY] OTP code for ${email}: ${code}`);
        }
        return { sent: true };
    }
    async verifyEmailOtp(rawEmail, code, name) {
        const email = this.normalizeEmail(rawEmail);
        if (!this.otpStore.verify(email, code)) {
            throw new common_1.UnauthorizedException('That code is incorrect or has expired.');
        }
        let user = await this.users.findOneBy({ email });
        if (!user) {
            user = await this.users.save(this.users.create({ email, name: name?.trim() || email.split('@')[0] }));
        }
        return this.issueSession(user);
    }
    async signInWithGoogle(idToken) {
        const audiences = (process.env.GOOGLE_CLIENT_IDS ?? '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        if (audiences.length === 0) {
            throw new Error('Google sign-in isn\'t configured — set GOOGLE_CLIENT_IDS in .env.');
        }
        if (!this.googleClient)
            this.googleClient = new google_auth_library_1.OAuth2Client();
        let payload;
        try {
            const ticket = await this.googleClient.verifyIdToken({ idToken, audience: audiences });
            payload = ticket.getPayload();
        }
        catch {
            throw new common_1.UnauthorizedException('Google sign-in failed. Please try again.');
        }
        if (!payload?.sub || !payload.email) {
            throw new common_1.UnauthorizedException('Google sign-in failed. Please try again.');
        }
        if (!payload.email_verified) {
            throw new common_1.UnauthorizedException('Your Google email address isn\'t verified.');
        }
        const googleId = payload.sub;
        const email = this.normalizeEmail(payload.email);
        let user = await this.users.findOneBy({ googleId });
        if (!user) {
            user = await this.users.findOneBy({ email });
            if (user) {
                user.googleId = googleId;
                await this.users.save(user);
            }
            else {
                user = await this.users.save(this.users.create({ googleId, email, name: payload.name?.trim() || email.split('@')[0] }));
            }
        }
        return this.issueSession(user);
    }
    findById(id) {
        return this.users.findOneByOrFail({ id });
    }
    async updateProfile(id, changes) {
        const user = await this.users.findOneByOrFail({ id });
        if (changes.phone && changes.phone !== user.phone) {
            const taken = await this.users.findOneBy({ phone: changes.phone });
            if (taken && taken.id !== user.id) {
                throw new common_1.ConflictException('That phone number is already linked to another account.');
            }
            user.phone = changes.phone;
        }
        if (changes.name !== undefined) {
            const name = changes.name.trim();
            if (!name)
                throw new common_1.BadRequestException('Name can\'t be empty.');
            user.name = name;
        }
        return this.users.save(user);
    }
    async issueSession(user) {
        const accessToken = await this.jwt.signAsync({ sub: user.id, email: user.email, type: 'customer' });
        return { user, accessToken };
    }
    normalizeEmail(email) {
        return email.trim().toLowerCase();
    }
    generateCode() {
        return (0, crypto_1.randomInt)(100000, 1000000).toString();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        otp_store_service_1.OtpStoreService,
        mail_service_1.MailService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map