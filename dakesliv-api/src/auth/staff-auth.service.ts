import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Staff } from './staff.entity';

@Injectable()
export class StaffAuthService {
  constructor(
    @InjectRepository(Staff) private readonly staff: Repository<Staff>,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, password: string): Promise<{ staff: Omit<Staff, 'passwordHash'>; accessToken: string }> {
    const account = await this.staff.findOneBy({ email });
    if (!account) {
      throw new UnauthorizedException('Incorrect email or password.');
    }

    const valid = await bcrypt.compare(password, account.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Incorrect email or password.');
    }

    // type: 'staff' distinguishes this from a customer token — StaffAuthGuard
    // checks for it, so a customer's OTP-issued token can never be used to
    // reach a staff-only route, even though both are signed with the same
    // JWT_SECRET.
    const accessToken = await this.jwt.signAsync({
      sub: account.id,
      email: account.email,
      role: account.role,
      businessUnitId: account.businessUnit?.id ?? null,
      type: 'staff',
    });

    const { passwordHash, ...safe } = account;
    return { staff: safe, accessToken };
  }

  /** Used by the admin layout to re-verify a session and get full staff
   * details after a page refresh, since the JWT payload alone is minimal. */
  async findById(id: string): Promise<Omit<Staff, 'passwordHash'>> {
    const account = await this.staff.findOneByOrFail({ id });
    const { passwordHash, ...safe } = account;
    return safe;
  }
}
