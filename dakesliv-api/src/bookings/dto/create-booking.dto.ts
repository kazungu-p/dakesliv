import { IsDateString, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  serviceId: string;

  @IsDateString()
  scheduledAt: string;
}
