import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, User } from '@prisma/client';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: Role[] =
      this.reflector.get(META_ROLES, context.getHandler()) || [];

    if (validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();

    const user = req.user as User;
    if (!user)
      throw new InternalServerErrorException('User not found in request');

    const authorize = validRoles.includes(user.role);

    if (!authorize) throw new ForbiddenException('Role of user invalid');

    return true;
  }
}
