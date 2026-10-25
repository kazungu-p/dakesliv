import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { StaffRole } from './staff.entity';

export interface StaffRequest extends Request {
  staff?: { id: string; email: string; role: StaffRole; businessUnitId: string | null };
}

interface StaffJwtPayload {
  sub: string;
  email: string;
  role: StaffRole;
  businessUnitId: string | null;
  type: string;
}

/** Marks which roles can access a route, e.g. @Roles(StaffRole.OWNER). */
export const Roles = (...roles: StaffRole[]) => SetMetadata('roles', roles);

@Injectable()
export class StaffAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<StaffRequest>();
    const authHeader = request.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      throw new UnauthorizedException('Staff sign-in required.');
    }

    let payload: StaffJwtPayload;
    try {
      payload = await this.jwt.verifyAsync<StaffJwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Your session has expired — sign in again.');
    }

    // Critical check: a customer's OTP-issued token verifies fine
    // cryptographically (same JWT_SECRET) but has no `type: 'staff'` claim
    // — without this check, any signed-in customer could reach admin routes.
    if (payload.type !== 'staff') {
      throw new UnauthorizedException('Staff sign-in required.');
    }

    request.staff = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      businessUnitId: payload.businessUnitId,
    };

    const requiredRoles = this.reflector.get<StaffRole[]>('roles', context.getHandler());
    if (requiredRoles && !requiredRoles.includes(payload.role)) {
      throw new UnauthorizedException("Your role doesn't have access to this.");
    }

    return true;
  }
}
