import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const META_ROLES = 'rol';

export const RoleProtected = (...args: Role[]) => SetMetadata(META_ROLES, args);
