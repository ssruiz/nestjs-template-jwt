import { Role } from '@prisma/client';
import { IsIn } from 'class-validator';

export class ChangeRoleDto {
  @IsIn([Role.ADMIN, Role.USER])
  role: Role;
}
