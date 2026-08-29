import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoundationAllocation } from './foundation-allocation.entity';
import { FoundationService } from './foundation.service';
import { FoundationController } from './foundation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FoundationAllocation])],
  controllers: [FoundationController],
  providers: [FoundationService],
  exports: [FoundationService],
})
export class FoundationModule {}
