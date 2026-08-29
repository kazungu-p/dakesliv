import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessUnit } from './business-unit.entity';
import { BusinessUnitsController } from './business-units.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessUnit])],
  controllers: [BusinessUnitsController],
  exports: [TypeOrmModule],
})
export class BusinessUnitsModule {}
