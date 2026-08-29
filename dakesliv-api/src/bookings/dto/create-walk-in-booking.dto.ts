import { IsDateString, IsOptional, IsUUID } from 'class-validator';

// For bookings created by staff at the physical office, not by the customer
// themselves — see BookingsController.createWalkIn(). Once staff/admin auth
// exists, this endpoint should require a staff JWT and staffId should come
// from that token rather than the request body, the same way CreateBookingDto
// no longer trusts a client-supplied userId.
export class CreateWalkInBookingDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  serviceId: string;

  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsUUID()
  staffId?: string;
}
