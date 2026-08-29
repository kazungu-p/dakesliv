import { IsEnum, IsNumberString, IsUUID } from 'class-validator';
import { PaymentMethod } from '../payment.entity';

export class CreatePaymentDto {
  @IsUUID()
  bookingId: string;

  @IsNumberString()
  amount: string;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;
}
