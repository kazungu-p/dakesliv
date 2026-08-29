import { Controller, Get } from '@nestjs/common';
import { InvoicingService } from './invoicing.service';

@Controller('invoices')
export class InvoicingController {
  constructor(private readonly invoicing: InvoicingService) {}

  // Admin-panel use: invoices stuck waiting on eTIMS transmission. Add auth
  // guards here once the admin panel's role system (see AuthModule) is wired up.
  @Get('pending')
  getPending() {
    return this.invoicing.findPendingRetries();
  }
}
