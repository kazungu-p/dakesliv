import 'dotenv/config';
import { DataSource } from 'typeorm';
import { BusinessUnit } from '../business-units/business-unit.entity';
import { Service } from '../services/service.entity';

// Placeholder prices in KES — these are NOT final. Confirm real pricing with
// the client before launch and re-run this script (it's safe to re-run;
// see the upsert-by-name logic below).
const seedData: {
  unit: { name: string; slug: string };
  services: { name: string; price: number; durationMinutes: number }[];
}[] = [
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

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [BusinessUnit, Service],
    synchronize: false,
  });

  await dataSource.initialize();
  const unitRepo = dataSource.getRepository(BusinessUnit);
  const serviceRepo = dataSource.getRepository(Service);

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
        // Re-runnable: update the price/duration rather than duplicate the row.
        existing.price = svc.price.toFixed(2);
        existing.durationMinutes = svc.durationMinutes;
        await serviceRepo.save(existing);
      } else {
        await serviceRepo.save(
          serviceRepo.create({
            businessUnit,
            name: svc.name,
            price: svc.price.toFixed(2),
            durationMinutes: svc.durationMinutes,
          }),
        );
      }
    }
    console.log(`Seeded ${services.length} services for ${unit.name}`);
  }

  await dataSource.destroy();
  console.log('Seed complete.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
