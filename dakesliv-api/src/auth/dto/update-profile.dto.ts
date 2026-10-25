import { IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  // International format, e.g. +254712345678 — used for M-Pesa payments.
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;
}
