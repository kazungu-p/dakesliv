import { Controller, Get } from '@nestjs/common';
import { FoundationService } from './foundation.service';

@Controller('foundation')
export class FoundationController {
  constructor(private readonly foundation: FoundationService) {}

  // Public — powers the website's "Impact" page, no auth required.
  @Get('impact')
  getImpact() {
    return this.foundation.getImpactSummary();
  }
}
