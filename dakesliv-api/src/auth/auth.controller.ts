import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestEmailOtpDto } from './dto/request-email-otp.dto';
import { VerifyEmailOtpDto } from './dto/verify-email-otp.dto';
import { GoogleSignInDto } from './dto/google-sign-in.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  // Email code sign-in (any mailbox: iCloud, Gmail, Outlook, ...)
  @Post('email/request')
  requestEmailOtp(@Body() dto: RequestEmailOtpDto) {
    return this.auth.requestEmailOtp(dto.email);
  }

  @Post('email/verify')
  verifyEmailOtp(@Body() dto: VerifyEmailOtpDto) {
    return this.auth.verifyEmailOtp(dto.email, dto.code, dto.name);
  }

  // Google sign-in: body is { idToken } from the Google sign-in SDK/button.
  @Post('google')
  google(@Body() dto: GoogleSignInDto) {
    return this.auth.signInWithGoogle(dto.idToken);
  }

  // Lets the client restore a session after a refresh and see whether a
  // phone number is on file yet (needed before an M-Pesa payment).
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: { id: string }) {
    return this.auth.findById(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@CurrentUser() user: { id: string }, @Body() dto: UpdateProfileDto) {
    return this.auth.updateProfile(user.id, dto);
  }
}
