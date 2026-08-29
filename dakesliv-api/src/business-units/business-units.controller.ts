import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessUnit } from './business-unit.entity';

@Controller('business-units')
export class BusinessUnitsController {
  constructor(
    @InjectRepository(BusinessUnit) private readonly units: Repository<BusinessUnit>,
  ) {}

  // Public — powers the website's four service-category cards.
  @Get()
  findAll() {
    return this.units.find({ relations: ['services'] });
  }
}
