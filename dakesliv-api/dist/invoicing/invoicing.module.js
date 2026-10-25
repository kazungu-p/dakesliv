"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const invoice_entity_1 = require("./invoice.entity");
const invoicing_service_1 = require("./invoicing.service");
const invoicing_controller_1 = require("./invoicing.controller");
const staff_auth_guard_1 = require("../auth/staff-auth.guard");
let InvoicingModule = class InvoicingModule {
};
exports.InvoicingModule = InvoicingModule;
exports.InvoicingModule = InvoicingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([invoice_entity_1.Invoice]),
            jwt_1.JwtModule.register({ secret: process.env.JWT_SECRET }),
        ],
        controllers: [invoicing_controller_1.InvoicingController],
        providers: [invoicing_service_1.InvoicingService, staff_auth_guard_1.StaffAuthGuard],
        exports: [invoicing_service_1.InvoicingService],
    })
], InvoicingModule);
//# sourceMappingURL=invoicing.module.js.map