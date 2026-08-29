import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './invoice.entity';
import { InvoicingService } from './invoicing.service';
import { InvoicingController } from './invoicing.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice])],
  controllers: [InvoicingController],
  providers: [InvoicingService],
  exports: [InvoicingService],
})
export class InvoicingModule {}
