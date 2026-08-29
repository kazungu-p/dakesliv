import { Body, Controller, ForbiddenException, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentMethod } from './payment.entity';
import { BookingsService } from '../bookings/bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly payments: PaymentsService,
    private readonly bookings: BookingsService,
  ) {}

  // Client-facing: kicks off payment for a booking (M-Pesa STK Push or
  // card). Requires the signed-in customer to actually own the booking
  // they're paying for — without this check, anyone with a valid session
  // could trigger payment (and the invoice/foundation records that follow)
  // against someone else's booking just by guessing a booking id.
  @UseGuards(JwtAuthGuard)
  @Post()
  async initiate(@Body() dto: CreatePaymentDto, @CurrentUser() user: { id: string }) {
    const booking = await this.bookings.findOne(dto.bookingId);
    if (booking.user.id !== user.id) {
      throw new ForbiddenException("That booking doesn't belong to you.");
    }
    if (dto.method === PaymentMethod.CASH) {
      throw new ForbiddenException('Cash payments can only be recorded from the admin panel.');
    }
    return this.payments.initiate(booking, dto.amount, dto.method);
  }

  // Front-desk flow: staff records a cash payment for a walk-in booking.
  // No staff auth guard yet — see the note on CreateWalkInBookingDto.
  @Post('walk-in')
  async initiateWalkIn(@Body() dto: CreatePaymentDto) {
    const booking = await this.bookings.findOne(dto.bookingId);
    return this.payments.initiate(booking, dto.amount, PaymentMethod.CASH);
  }

  // Called by IntaSend's webhook once M-Pesa/card money clears (or fails).
  // Configure this URL in the IntaSend dashboard as your webhook endpoint.
  // TODO: IntaSend lets you set a "challenge" string in their dashboard,
  // included in every webhook payload — verify it against
  // process.env.INTASEND_WEBHOOK_CHALLENGE here before trusting the
  // payload, so a stranger can't call this URL directly to fake a payment.
  @Post('webhook/intasend')
  async intasendWebhook(@Body() body: { api_ref?: string; state?: string }) {
    if (body.state === 'COMPLETE' && body.api_ref) {
      await this.payments.confirm(body.api_ref);
    } else if (body.state === 'FAILED' && body.api_ref) {
      await this.payments.markFailed(body.api_ref);
    }
    return { received: true };
  }

  // Manual confirmation path — useful for cash (already confirmed
  // synchronously in initiateWalkIn, so rarely called directly) or for
  // manually re-triggering the compliance chain during testing.
  @Post(':id/confirm')
  confirm(@Param('id') id: string) {
    return this.payments.confirm(id);
  }

  // Payment page polls this while waiting on the IntaSend webhook —
  // ownership-checked the same way as booking lookups.
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOneForUser(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    const payment = await this.payments.findOne(id);
    if (payment.booking.user.id !== user.id) {
      throw new ForbiddenException("That payment doesn't belong to you.");
    }
    return payment;
  }
}
