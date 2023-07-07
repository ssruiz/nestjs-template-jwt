import { UseGuards, applyDecorators } from '@nestjs/common';

import { RoleProtected } from './role-protected.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { UserRoleGuard } from '../guards/user-role.guard';
import { Role } from '@prisma/client';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard, UserRoleGuard),
  );
}
