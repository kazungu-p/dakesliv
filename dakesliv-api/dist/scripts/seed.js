"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const bcrypt = __importStar(require("bcrypt"));
const typeorm_1 = require("typeorm");
const business_unit_entity_1 = require("../business-units/business-unit.entity");
const service_entity_1 = require("../services/service.entity");
const staff_entity_1 = require("../auth/staff.entity");
const seedData = [
    {
        unit: { name: 'Grooming & Wellness', slug: 'grooming' },
        services: [
            { name: 'Haircut, skin fade & beard grooming', price: 1500, durationMinutes: 45 },
            { name: 'Hair styling & braiding', price: 2500, durationMinutes: 90 },
            { name: 'Manicure & pedicure', price: 2000, durationMinutes: 60 },
            { name: 'Bridal package', price: 15000, durationMinutes: 180 },
            { name: 'Massage & relaxation treatment', price: 3500, durationMinutes: 60 },
        ],
    },
    {
        unit: { name: 'Catering & Event Management', slug: 'events' },
        services: [
            { name: 'Wedding planning package', price: 250000, durationMinutes: 0 },
            { name: 'Corporate event package', price: 120000, durationMinutes: 0 },
            { name: 'Catering only (per 100 guests)', price: 80000, durationMinutes: 0 },
            { name: 'Décor & event design', price: 45000, durationMinutes: 0 },
            { name: 'Full event coordination (day-of)', price: 35000, durationMinutes: 0 },
        ],
    },
    {
        unit: { name: 'VIP Security Solutions', slug: 'security' },
        services: [
            { name: 'Event security (per event, up to 8 hrs)', price: 25000, durationMinutes: 480 },
            { name: 'VIP protection / executive security (per day)', price: 15000, durationMinutes: 1440 },
            { name: 'Office & retail security (monthly)', price: 60000, durationMinutes: 0 },
            { name: 'Security risk assessment', price: 10000, durationMinutes: 120 },
            { name: 'Bodyguard services (per day)', price: 12000, durationMinutes: 1440 },
        ],
    },
    {
        unit: { name: 'App & Website Development', slug: 'digital' },
        services: [
            { name: 'Business website', price: 80000, durationMinutes: 0 },
            { name: 'E-commerce website', price: 150000, durationMinutes: 0 },
            { name: 'Mobile app (iOS & Android)', price: 350000, durationMinutes: 0 },
            { name: 'Branding & marketing materials', price: 40000, durationMinutes: 0 },
            { name: 'Website maintenance (monthly)', price: 8000, durationMinutes: 0 },
        ],
    },
];
async function seed(dataSource) {
    const unitRepo = dataSource.getRepository(business_unit_entity_1.BusinessUnit);
    const serviceRepo = dataSource.getRepository(service_entity_1.Service);
    for (const { unit, services } of seedData) {
        let businessUnit = await unitRepo.findOneBy({ slug: unit.slug });
        if (!businessUnit) {
            businessUnit = await unitRepo.save(unitRepo.create(unit));
            console.log(`Created business unit: ${unit.name}`);
        }
        for (const svc of services) {
            const existing = await serviceRepo.findOne({
                where: { name: svc.name, businessUnit: { id: businessUnit.id } },
            });
            if (existing) {
                existing.price = svc.price.toFixed(2);
                existing.durationMinutes = svc.durationMinutes;
                await serviceRepo.save(existing);
            }
            else {
                await serviceRepo.save(serviceRepo.create({
                    businessUnit,
                    name: svc.name,
                    price: svc.price.toFixed(2),
                    durationMinutes: svc.durationMinutes,
                }));
            }
        }
        console.log(`Seeded ${services.length} services for ${unit.name}`);
    }
    console.log('Seed complete.');
}
async function seedOwnerAccount(dataSource) {
    const { SEED_OWNER_EMAIL, SEED_OWNER_PASSWORD, SEED_OWNER_NAME } = process.env;
    if (!SEED_OWNER_EMAIL || !SEED_OWNER_PASSWORD) {
        console.log('SEED_OWNER_EMAIL/SEED_OWNER_PASSWORD not set — skipping staff account creation.');
        return;
    }
    const staffRepo = dataSource.getRepository(staff_entity_1.Staff);
    const existing = await staffRepo.findOneBy({ email: SEED_OWNER_EMAIL });
    if (existing) {
        console.log(`Owner account for ${SEED_OWNER_EMAIL} already exists — skipping.`);
    }
    else {
        const passwordHash = await bcrypt.hash(SEED_OWNER_PASSWORD, 12);
        await staffRepo.save(staffRepo.create({
            email: SEED_OWNER_EMAIL,
            passwordHash,
            name: SEED_OWNER_NAME || 'Owner',
            role: staff_entity_1.StaffRole.OWNER,
        }));
        console.log(`Created OWNER account for ${SEED_OWNER_EMAIL}.`);
    }
}
async function main() {
    const dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [business_unit_entity_1.BusinessUnit, service_entity_1.Service, staff_entity_1.Staff],
        synchronize: false,
    });
    await dataSource.initialize();
    await seed(dataSource);
    await seedOwnerAccount(dataSource);
    await dataSource.destroy();
}
main().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map