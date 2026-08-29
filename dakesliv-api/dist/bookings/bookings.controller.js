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
exports.BookingsController = void 0;
const common_1 = require("@nestjs/common");
const bookings_service_1 = require("./bookings.service");
const create_booking_dto_1 = require("./dto/create-booking.dto");
const create_walk_in_booking_dto_1 = require("./dto/create-walk-in-booking.dto");
const booking_entity_1 = require("./booking.entity");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
let BookingsController = class BookingsController {
    constructor(bookings) {
        this.bookings = bookings;
    }
    create(dto, user) {
        return this.bookings.createFromIds(user.id, dto.serviceId, new Date(dto.scheduledAt), booking_entity_1.BookingChannel.ONLINE);
    }
    createWalkIn(dto) {
        return this.bookings.createFromIds(dto.userId, dto.serviceId, new Date(dto.scheduledAt), booking_entity_1.BookingChannel.WALK_IN, dto.staffId);
    }
    findToday() {
        return this.bookings.findForToday();
    }
    async findOneForUser(id, user) {
        const booking = await this.bookings.findOne(id);
        if (booking.user.id !== user.id) {
            throw new common_1.ForbiddenException("That booking doesn't belong to you.");
        }
        return booking;
    }
    findForUnit(businessUnitId) {
        return this.bookings.findForUnit(businessUnitId);
    }
};
exports.BookingsController = BookingsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_booking_dto_1.CreateBookingDto, Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('walk-in'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_walk_in_booking_dto_1.CreateWalkInBookingDto]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "createWalkIn", null);
__decorate([
    (0, common_1.Get)('today'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "findToday", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "findOneForUser", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('businessUnitId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "findForUnit", null);
exports.BookingsController = BookingsController = __decorate([
    (0, common_1.Controller)('bookings'),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService])
], BookingsController);
//# sourceMappingURL=bookings.controller.js.map