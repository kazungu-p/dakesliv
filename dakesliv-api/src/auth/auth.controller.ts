import { Body, Controller, Post } from '@nestjs/common';
import { AuthService, OtpChannel } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('otp/request')
  requestOtp(@Body('phone') phone: string, @Body('channel') channel?: OtpChannel) {
    return this.auth.requestOtp(phone, channel);
  }

  @Post('otp/verify')
  verifyOtp(@Body('phone') phone: string, @Body('code') code: string) {
    return this.auth.verifyOtp(phone, code);
  }
}
