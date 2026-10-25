import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { StaffRequest } from './staff-auth.guard';

export const CurrentStaff = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<StaffRequest>();
  return request.staff;
});
