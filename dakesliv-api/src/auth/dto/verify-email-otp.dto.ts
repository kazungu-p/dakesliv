import { IsEmail, IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class VerifyEmailOtpDto {
  @IsEmail()
  email: string;

  @Length(6, 6)
  code: string;

  // Only used when this sign-in creates a brand-new account.
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}
