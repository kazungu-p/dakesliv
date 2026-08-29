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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
const create_payment_dto_1 = require("./dto/create-payment.dto");
const payment_entity_1 = require("./payment.entity");
const bookings_service_1 = require("../bookings/bookings.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
let PaymentsController = class PaymentsController {
    constructor(payments, bookings) {
        this.payments = payments;
        this.bookings = bookings;
    }
    async initiate(dto, user) {
        const booking = await this.bookings.findOne(dto.bookingId);
        if (booking.user.id !== user.id) {
            throw new common_1.ForbiddenException("That booking doesn't belong to you.");
        }
        if (dto.method === payment_entity_1.PaymentMethod.CASH) {
            throw new common_1.ForbiddenException('Cash payments can only be recorded from the admin panel.');
        }
        return this.payments.initiate(booking, dto.amount, dto.method);
    }
    async initiateWalkIn(dto) {
        const booking = await this.bookings.findOne(dto.bookingId);
        return this.payments.initiate(booking, dto.amount, payment_entity_1.PaymentMethod.CASH);
    }
    async intasendWebhook(body) {
        if (body.state === 'COMPLETE' && body.api_ref) {
            await this.payments.confirm(body.api_ref);
        }
        else if (body.state === 'FAILED' && body.api_ref) {
            await this.payments.markFailed(body.api_ref);
        }
        return { received: true };
    }
    confirm(id) {
        return this.payments.confirm(id);
    }
    async findOneForUser(id, user) {
        const payment = await this.payments.findOne(id);
        if (payment.booking.user.id !== user.id) {
            throw new common_1.ForbiddenException("That payment doesn't belong to you.");
        }
        return payment;
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_1.CreatePaymentDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "initiate", null);
__decorate([
    (0, common_1.Post)('walk-in'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_1.CreatePaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "initiateWalkIn", null);
__decorate([
    (0, common_1.Post)('webhook/intasend'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "intasendWebhook", null);
__decorate([
    (0, common_1.Post)(':id/confirm'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "confirm", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "findOneForUser", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService,
        bookings_service_1.BookingsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map