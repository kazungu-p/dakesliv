import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { StaffAuthService } from './staff-auth.service';
import { StaffAuthGuard } from './staff-auth.guard';
import { CurrentStaff } from './current-staff.decorator';
import { StaffLoginDto } from './dto/staff-login.dto';

@Controller('staff/auth')
export class StaffAuthController {
  constructor(private readonly staffAuth: StaffAuthService) {}

  @Post('login')
  login(@Body() dto: StaffLoginDto) {
    return this.staffAuth.login(dto.email, dto.password);
  }

  // Lets the admin panel re-verify a session and get full staff details
  // (name, businessUnit) after a page refresh, since the JWT payload alone
  // is minimal.
  @UseGuards(StaffAuthGuard)
  @Get('me')
  me(@CurrentStaff() current: { id: string }) {
    return this.staffAuth.findById(current.id);
  }
}
