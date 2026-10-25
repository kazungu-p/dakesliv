import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Staff } from './staff.entity';
import { StaffAuthService } from './staff-auth.service';
import { StaffAuthController } from './staff-auth.controller';
import { StaffAuthGuard } from './staff-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Staff]),
    // 12-hour expiry — shorter than the customer token's 30 days on
    // purpose. Staff accounts can touch every customer's data and payment
    // records, so a lost device or leaked token should stop working
    // within a work day, not stay valid indefinitely. Was previously
    // unset entirely, which meant staff tokens never expired at all.
    JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: '12h' } }),
  ],
  controllers: [StaffAuthController],
  providers: [StaffAuthService, StaffAuthGuard],
  exports: [StaffAuthService, StaffAuthGuard],
})
export class StaffAuthModule {}
