import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Payment } from './payment.entity';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { InvoicingModule } from '../invoicing/invoicing.module';
import { FoundationModule } from '../foundation/foundation.module';
import { BookingsModule } from '../bookings/bookings.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    InvoicingModule,
    FoundationModule,
    BookingsModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, JwtAuthGuard],
  exports: [PaymentsService],
})
export class PaymentsModule {}
