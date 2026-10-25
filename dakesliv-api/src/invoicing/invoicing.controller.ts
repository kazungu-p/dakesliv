import { Controller, Get, UseGuards } from '@nestjs/common';
import { InvoicingService } from './invoicing.service';
import { StaffAuthGuard, Roles } from '../auth/staff-auth.guard';
import { StaffRole } from '../auth/staff.entity';

@Controller('invoices')
export class InvoicingController {
  constructor(private readonly invoicing: InvoicingService) {}

  // Admin panel: invoices stuck waiting on eTIMS transmission. Financial
  // visibility — restricted to owners, not front-desk or unit managers.
  @UseGuards(StaffAuthGuard)
  @Roles(StaffRole.OWNER)
  @Get('pending')
  getPending() {
    return this.invoicing.findPendingRetries();
  }
}
