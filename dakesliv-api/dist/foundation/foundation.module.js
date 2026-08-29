"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoundationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const foundation_allocation_entity_1 = require("./foundation-allocation.entity");
const foundation_service_1 = require("./foundation.service");
const foundation_controller_1 = require("./foundation.controller");
let FoundationModule = class FoundationModule {
};
exports.FoundationModule = FoundationModule;
exports.FoundationModule = FoundationModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([foundation_allocation_entity_1.FoundationAllocation])],
        controllers: [foundation_controller_1.FoundationController],
        providers: [foundation_service_1.FoundationService],
        exports: [foundation_service_1.FoundationService],
    })
], FoundationModule);
//# sourceMappingURL=foundation.module.js.map