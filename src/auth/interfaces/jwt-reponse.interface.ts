import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class JWTResponse {
  @ApiProperty({
    description: 'Token de usuario',
    example: '1234',
  })
  access_token: string;
}
