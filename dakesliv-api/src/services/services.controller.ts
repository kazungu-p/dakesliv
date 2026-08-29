import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './service.entity';

@Controller('services')
export class ServicesController {
  constructor(@InjectRepository(Service) private readonly services: Repository<Service>) {}

  // Public — powers each /[unit] page's service list.
  @Get()
  findAll(@Query('businessUnitId') businessUnitId?: string) {
    if (businessUnitId) {
      return this.services.find({ where: { businessUnit: { id: businessUnitId } } });
    }
    return this.services.find();
  }

  // Public — powers the booking page, which needs one service's name/price
  // without knowing which business unit it belongs to ahead of time.
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const service = await this.services.findOneBy({ id });
    if (!service) throw new NotFoundException('Service not found.');
    return service;
  }
}
