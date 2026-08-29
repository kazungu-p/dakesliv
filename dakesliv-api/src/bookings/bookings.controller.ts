import { Body, Controller, ForbiddenException, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateWalkInBookingDto } from './dto/create-walk-in-booking.dto';
import { BookingChannel } from './booking.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  // The real public booking flow. Requires a valid customer session token —
  // the booking is always created for whoever is actually signed in, never
  // for a userId the client claims in the request body.
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateBookingDto, @CurrentUser() user: { id: string }) {
    return this.bookings.createFromIds(
      user.id,
      dto.serviceId,
      new Date(dto.scheduledAt),
      BookingChannel.ONLINE,
    );
  }

  // Front-desk flow from the admin panel — no staff auth guard yet (that
  // system doesn't exist), so this is intentionally unguarded for now. Do
  // not expose this route to the public internet without one; see the TODO
  // on CreateWalkInBookingDto.
  @Post('walk-in')
  createWalkIn(@Body() dto: CreateWalkInBookingDto) {
    return this.bookings.createFromIds(
      dto.userId,
      dto.serviceId,
      new Date(dto.scheduledAt),
      BookingChannel.WALK_IN,
      dto.staffId,
    );
  }

  // Admin panel: front-desk "today's schedule" view.
  @Get('today')
  findToday() {
    return this.bookings.findForToday();
  }

  // Booking confirmation / payment page needs this — ownership-checked so
  // one customer can't view another's booking by guessing an id.
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOneForUser(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    const booking = await this.bookings.findOne(id);
    if (booking.user.id !== user.id) {
      throw new ForbiddenException("That booking doesn't belong to you.");
    }
    return booking;
  }

  // Admin panel: a business unit manager's bookings.
  @Get()
  findForUnit(@Query('businessUnitId') businessUnitId: string) {
    return this.bookings.findForUnit(businessUnitId);
  }
}
