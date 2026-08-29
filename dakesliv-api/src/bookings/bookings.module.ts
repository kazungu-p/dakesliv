import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Booking } from './booking.entity';
import { User } from '../auth/user.entity';
import { Service } from '../services/service.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, User, Service]),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  controllers: [BookingsController],
  providers: [BookingsService, JwtAuthGuard],
  exports: [BookingsService],
})
export class BookingsModule {}
