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
exports.FoundationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const foundation_allocation_entity_1 = require("./foundation-allocation.entity");
let FoundationService = class FoundationService {
    constructor(allocations) {
        this.allocations = allocations;
    }
    async allocateFromPayment(payment, percentage) {
        const amount = (parseFloat(payment.amount) * percentage).toFixed(2);
        const allocation = this.allocations.create({
            payment,
            amount,
            category: foundation_allocation_entity_1.FoundationCategory.SCHOLARSHIPS,
        });
        return this.allocations.save(allocation);
    }
    async getImpactSummary() {
        const rows = await this.allocations.find();
        const total = rows.reduce((sum, r) => sum + parseFloat(r.amount), 0);
        const byCategory = {};
        for (const r of rows) {
            byCategory[r.category] = (byCategory[r.category] ?? 0) + parseFloat(r.amount);
        }
        return { total: total.toFixed(2), byCategory };
    }
};
exports.FoundationService = FoundationService;
exports.FoundationService = FoundationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(foundation_allocation_entity_1.FoundationAllocation)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FoundationService);
//# sourceMappingURL=foundation.service.js.map