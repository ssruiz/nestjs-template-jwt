import { Role } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class User {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  ci: string;

  @ApiProperty({ type: String })
  password?: string;

  @ApiPropertyOptional({ type: String })
  fullname?: string;

  @ApiProperty({ enum: Role, enumName: 'Role' })
  role: Role = Role.USER;

  @ApiProperty({ type: Boolean })
  isActive: boolean = true;
}
