import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({
    description: 'Cedula de indentidad del usario',
    required: true,
    example: '1234',
  })
  @IsString({ message: 'CI debe ser un string' })
  @IsNotEmpty({ message: 'CI no debe estar vacio' })
  ci: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    required: true,
    example: '1234',
  })
  @IsString({ message: 'Password debe ser un string' })
  @IsNotEmpty({ message: 'Password no debe estar vacio' })
  password: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Perez',
    required: false,
  })
  @IsString({ message: 'Nombre debe ser un string' })
  @IsOptional()
  fullname?: string;
}
