"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const booking_entity_1 = require("./booking.entity");
const user_entity_1 = require("../auth/user.entity");
const service_entity_1 = require("../services/service.entity");
const bookings_service_1 = require("./bookings.service");
const bookings_controller_1 = require("./bookings.controller");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let BookingsModule = class BookingsModule {
};
exports.BookingsModule = BookingsModule;
exports.BookingsModule = BookingsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([booking_entity_1.Booking, user_entity_1.User, service_entity_1.Service]),
            jwt_1.JwtModule.register({ secret: process.env.JWT_SECRET }),
        ],
        controllers: [bookings_controller_1.BookingsController],
        providers: [bookings_service_1.BookingsService, jwt_auth_guard_1.JwtAuthGuard],
        exports: [bookings_service_1.BookingsService],
    })
], BookingsModule);
//# sourceMappingURL=bookings.module.js.map