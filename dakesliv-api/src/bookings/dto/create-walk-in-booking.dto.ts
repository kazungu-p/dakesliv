import { IsDateString, IsOptional, IsPhoneNumber, IsUUID, IsString } from 'class-validator';

// For bookings created by staff at the physical office. Front-desk staff
// identify a customer by phone number, not an internal UUID — the service
// finds an existing customer by phone or creates one on the spot, the same
// way a walk-in actually works.
export class CreateWalkInBookingDto {
  @IsPhoneNumber()
  customerPhone: string;

  // Only used if this phone number doesn't match an existing customer.
  @IsOptional()
  @IsString()
  customerName?: string;

  @IsUUID()
  serviceId: string;

  @IsDateString()
  scheduledAt: string;
}
