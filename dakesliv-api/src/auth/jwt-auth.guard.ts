import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: { id: string; email?: string };
}

interface CustomerJwtPayload {
  sub: string;
  email?: string;
  type?: string;
}

/**
 * Protects endpoints that must be called as a signed-in customer (creating
 * a booking, initiating a payment). Expects `Authorization: Bearer <token>`
 * with the JWT issued by AuthService (verifyEmailOtp / signInWithGoogle).
 *
 * This is deliberately separate from StaffAuthGuard — a customer token
 * should never be usable to reach admin-only routes, and (the check below)
 * a staff token should never be usable to reach customer-only routes
 * either. Without the type check, a staff member's token would pass
 * verification here (same JWT_SECRET) and be treated as a customer id that
 * happens not to exist in the `users` table — failing, but for the wrong
 * reason, with a confusing error instead of a clear permission denial.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      throw new UnauthorizedException('Sign in required.');
    }

    let payload: CustomerJwtPayload;
    try {
      payload = await this.jwt.verifyAsync<CustomerJwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Your session has expired — sign in again.');
    }

    if (payload.type === 'staff') {
      throw new UnauthorizedException('This action requires a customer account, not a staff login.');
    }

    request.user = { id: payload.sub, email: payload.email };
    return true;
  }
}
