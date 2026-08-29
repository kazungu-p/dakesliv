import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { BusinessUnitsModule } from './business-units/business-units.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { InvoicingModule } from './invoicing/invoicing.module';
import { FoundationModule } from './foundation/foundation.module';

import { User } from './auth/user.entity';
import { BusinessUnit } from './business-units/business-unit.entity';
import { Service } from './services/service.entity';
import { Booking } from './bookings/booking.entity';
import { Payment } from './payments/payment.entity';
import { Invoice } from './invoicing/invoice.entity';
import { FoundationAllocation } from './foundation/foundation-allocation.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, BusinessUnit, Service, Booking, Payment, Invoice, FoundationAllocation],
      synchronize: process.env.NODE_ENV !== 'production', // use migrations in production
    }),
    AuthModule,
    BusinessUnitsModule,
    ServicesModule,
    BookingsModule,
    PaymentsModule,
    InvoicingModule,
    FoundationModule,
  ],
})
export class AppModule {}
