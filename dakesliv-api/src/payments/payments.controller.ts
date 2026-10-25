import { Body, Controller, ForbiddenException, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentMethod } from './payment.entity';
import { BookingsService } from '../bookings/bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { StaffAuthGuard } from '../auth/staff-auth.guard';

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
    // amount always comes from the booking's real service price, never
    // from the client — see the note on CreatePaymentDto.
    return this.payments.initiate(booking, booking.service.price, dto.method, dto.phone);
  }

  // Front-desk flow: staff records a payment (cash, or M-Pesa collected
  // directly at the till) for a walk-in booking. Always confirms
  // immediately — see PaymentsService.recordWalkInPayment().
  @UseGuards(StaffAuthGuard)
  @Post('walk-in')
  async initiateWalkIn(@Body() dto: CreatePaymentDto) {
    const booking = await this.bookings.findOne(dto.bookingId);
    return this.payments.recordWalkInPayment(booking, booking.service.price, dto.method);
  }

  // Called by IntaSend's webhook once M-Pesa/card money clears (or fails).
  // Configure this URL in the IntaSend dashboard as your webhook endpoint,
  // and set the same "challenge" string there and in
  // INTASEND_WEBHOOK_CHALLENGE — without this check, anyone could POST
  // here directly and fake a successful payment.
  @Post('webhook/intasend')
  async intasendWebhook(@Body() body: { api_ref?: string; state?: string; challenge?: string }) {
    const expected = process.env.INTASEND_WEBHOOK_CHALLENGE;
    if (!expected) {
      // Refuses to process an unverifiable webhook in production. In dev,
      // this is allowed through so local testing doesn't require a full
      // IntaSend dashboard setup — mirrors the dev-only OTP logging
      // pattern in AuthService.
      if (process.env.NODE_ENV === 'production') {
        throw new ForbiddenException('Webhook not configured — set INTASEND_WEBHOOK_CHALLENGE.');
      }
    } else if (body.challenge !== expected) {
      throw new ForbiddenException('Invalid webhook challenge.');
    }

    if (body.state === 'COMPLETE' && body.api_ref) {
      await this.payments.confirm(body.api_ref);
    } else if (body.state === 'FAILED' && body.api_ref) {
      await this.payments.markFailed(body.api_ref);
    }
    return { received: true };
  }

  // Manual confirmation path — for testing, or staff manually confirming a
  // payment that the webhook missed. Not customer-facing: a customer's
  // payment always confirms automatically via the webhook or the walk-in
  // cash flow, never through them calling this directly.
  @UseGuards(StaffAuthGuard)
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
