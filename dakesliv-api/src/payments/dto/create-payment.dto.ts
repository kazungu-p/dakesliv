import { IsEnum, IsOptional, IsPhoneNumber, IsUUID } from 'class-validator';
import { PaymentMethod } from '../payment.entity';

// amount is deliberately NOT accepted here — it's always derived
// server-side from the booking's actual service price (see
// PaymentsController), never trusted from the client. Accepting a
// client-supplied amount would let anyone charge whatever they want for
// any booking by simply changing the request body.
export class CreatePaymentDto {
  @IsUUID()
  bookingId: string;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  // M-Pesa number to send the STK Push to (international format, e.g.
  // +254712345678). Optional: falls back to the phone saved on the customer's
  // account. Required for MPESA if neither exists — customers who signed in
  // with Google or email won't have one until they give it here.
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;
}
