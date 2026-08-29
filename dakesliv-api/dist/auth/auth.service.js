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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = exports.OtpChannel = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const africastalking_1 = __importDefault(require("africastalking"));
const user_entity_1 = require("./user.entity");
const otp_store_service_1 = require("./otp-store.service");
var OtpChannel;
(function (OtpChannel) {
    OtpChannel["SMS"] = "sms";
    OtpChannel["WHATSAPP"] = "whatsapp";
    OtpChannel["EMAIL"] = "email";
})(OtpChannel || (exports.OtpChannel = OtpChannel = {}));
let AuthService = AuthService_1 = class AuthService {
    constructor(users, otpStore, jwt) {
        this.users = users;
        this.otpStore = otpStore;
        this.jwt = jwt;
        this.logger = new common_1.Logger(AuthService_1.name);
        this.client = null;
    }
    async requestOtp(phone, preferredChannel) {
        const channel = preferredChannel ?? this.defaultChannelFor(phone);
        const code = this.generateCode();
        this.otpStore.set(phone, code);
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
                    this.logger.warn(`Email OTP requested for ${phone} but email sending isn't wired up yet.`);
                    break;
            }
        }
        catch (err) {
            if (!isDev)
                throw err;
            this.logger.warn(`[DEV ONLY] Couldn't actually deliver the OTP to ${phone} (${err.message}) — ` +
                `continuing anyway since NODE_ENV isn't 'production'. Use the code below to sign in.`);
        }
        if (isDev) {
            this.logger.log(`[DEV ONLY] OTP code for ${phone}: ${code}`);
        }
        return { sent: true, channel };
    }
    async verifyOtp(phone, code) {
        const valid = this.otpStore.verify(phone, code);
        if (!valid) {
            throw new common_1.UnauthorizedException('That code is incorrect or has expired.');
        }
        let user = await this.users.findOneBy({ phone });
        if (!user) {
            user = this.users.create({ phone, name: 'New customer' });
            await this.users.save(user);
        }
        const accessToken = await this.jwt.signAsync({ sub: user.id, phone: user.phone });
        return { user, accessToken };
    }
    getClient() {
        if (!process.env.AFRICAS_TALKING_API_KEY || !process.env.AFRICAS_TALKING_USERNAME) {
            throw new Error("Africa's Talking isn't configured — set AFRICAS_TALKING_API_KEY and AFRICAS_TALKING_USERNAME in .env.");
        }
        if (!this.client) {
            this.client = (0, africastalking_1.default)({
                apiKey: process.env.AFRICAS_TALKING_API_KEY,
                username: process.env.AFRICAS_TALKING_USERNAME,
            });
        }
        return this.client;
    }
    defaultChannelFor(phone) {
        return phone.startsWith('+254') ? OtpChannel.SMS : OtpChannel.WHATSAPP;
    }
    generateCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async sendSms(phone, code) {
        const sms = this.getClient().SMS;
        await sms.send({
            to: [phone],
            message: `Your DAKESLIV verification code is ${code}. It expires in 5 minutes.`,
        });
    }
    async sendWhatsApp(phone, code) {
        const whatsapp = this.getClient().WHATSAPP;
        await whatsapp.sendMessage({
            waNumber: process.env.AFRICAS_TALKING_WA_NUMBER,
            phoneNumber: phone,
            body: {
                message: `Your DAKESLIV verification code is ${code}. It expires in 5 minutes.`,
            },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        otp_store_service_1.OtpStoreService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map