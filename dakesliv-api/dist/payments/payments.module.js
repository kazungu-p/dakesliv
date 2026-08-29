"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const payment_entity_1 = require("./payment.entity");
const payments_service_1 = require("./payments.service");
const payments_controller_1 = require("./payments.controller");
const invoicing_module_1 = require("../invoicing/invoicing.module");
const foundation_module_1 = require("../foundation/foundation.module");
const bookings_module_1 = require("../bookings/bookings.module");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let PaymentsModule = class PaymentsModule {
};
exports.PaymentsModule = PaymentsModule;
exports.PaymentsModule = PaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([payment_entity_1.Payment]),
            invoicing_module_1.InvoicingModule,
            foundation_module_1.FoundationModule,
            bookings_module_1.BookingsModule,
            jwt_1.JwtModule.register({ secret: process.env.JWT_SECRET }),
        ],
        controllers: [payments_controller_1.PaymentsController],
        providers: [payments_service_1.PaymentsService, jwt_auth_guard_1.JwtAuthGuard],
        exports: [payments_service_1.PaymentsService],
    })
], PaymentsModule);
//# sourceMappingURL=payments.module.js.map