"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const business_units_module_1 = require("./business-units/business-units.module");
const services_module_1 = require("./services/services.module");
const bookings_module_1 = require("./bookings/bookings.module");
const payments_module_1 = require("./payments/payments.module");
const invoicing_module_1 = require("./invoicing/invoicing.module");
const foundation_module_1 = require("./foundation/foundation.module");
const user_entity_1 = require("./auth/user.entity");
const business_unit_entity_1 = require("./business-units/business-unit.entity");
const service_entity_1 = require("./services/service.entity");
const booking_entity_1 = require("./bookings/booking.entity");
const payment_entity_1 = require("./payments/payment.entity");
const invoice_entity_1 = require("./invoicing/invoice.entity");
const foundation_allocation_entity_1 = require("./foundation/foundation-allocation.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                url: process.env.DATABASE_URL,
                entities: [user_entity_1.User, business_unit_entity_1.BusinessUnit, service_entity_1.Service, booking_entity_1.Booking, payment_entity_1.Payment, invoice_entity_1.Invoice, foundation_allocation_entity_1.FoundationAllocation],
                synchronize: process.env.NODE_ENV !== 'production',
            }),
            auth_module_1.AuthModule,
            business_units_module_1.BusinessUnitsModule,
            services_module_1.ServicesModule,
            bookings_module_1.BookingsModule,
            payments_module_1.PaymentsModule,
            invoicing_module_1.InvoicingModule,
            foundation_module_1.FoundationModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map