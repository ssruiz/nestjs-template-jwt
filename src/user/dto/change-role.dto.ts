import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsIn } from 'class-validator';

export class ChangeRoleDto {
  @ApiProperty({
    enum: Role,
  })
  @IsIn([Role.ADMIN, Role.USER])
  role: Role;
}
