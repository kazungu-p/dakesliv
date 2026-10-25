import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Invoice } from './invoice.entity';
import { InvoicingService } from './invoicing.service';
import { InvoicingController } from './invoicing.controller';
import { StaffAuthGuard } from '../auth/staff-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice]),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  controllers: [InvoicingController],
  providers: [InvoicingService, StaffAuthGuard],
  exports: [InvoicingService],
})
export class InvoicingModule {}
