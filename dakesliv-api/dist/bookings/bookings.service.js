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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("./booking.entity");
const user_entity_1 = require("../auth/user.entity");
const service_entity_1 = require("../services/service.entity");
let BookingsService = class BookingsService {
    constructor(bookings, users, services) {
        this.bookings = bookings;
        this.users = users;
        this.services = services;
    }
    async createFromIds(userId, serviceId, scheduledAt, channel = booking_entity_1.BookingChannel.ONLINE, staffId) {
        const user = await this.users.findOneByOrFail({ id: userId });
        const service = await this.services.findOneByOrFail({ id: serviceId });
        const booking = this.bookings.create({
            user,
            service,
            scheduledAt,
            channel,
            staffId,
            status: booking_entity_1.BookingStatus.PENDING,
        });
        return this.bookings.save(booking);
    }
    findOne(id) {
        return this.bookings.findOneByOrFail({ id });
    }
    findForToday() {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        return this.bookings
            .createQueryBuilder('booking')
            .where('booking.scheduledAt BETWEEN :start AND :end', { start, end })
            .orderBy('booking.scheduledAt', 'ASC')
            .getMany();
    }
    findForUnit(businessUnitId) {
        return this.bookings
            .createQueryBuilder('booking')
            .leftJoinAndSelect('booking.service', 'service')
            .where('service.businessUnitId = :businessUnitId', { businessUnitId })
            .getMany();
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(service_entity_1.Service)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map