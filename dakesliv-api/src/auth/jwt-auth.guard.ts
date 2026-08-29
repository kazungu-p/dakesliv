import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: { id: string; phone: string };
}

/**
 * Protects endpoints that must be called as a signed-in customer (creating
 * a booking, initiating a payment). Expects `Authorization: Bearer <token>`
 * with the JWT issued by AuthService.verifyOtp().
 *
 * This is deliberately separate from any future staff/admin guard — a
 * customer token should never be usable to reach admin-only routes.
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

    try {
      const payload = await this.jwt.verifyAsync<{ sub: string; phone: string }>(token);
      request.user = { id: payload.sub, phone: payload.phone };
      return true;
    } catch {
      throw new UnauthorizedException('Your session has expired — sign in again.');
    }
  }
}
