import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsString({ message: 'CI debe ser un string' })
  @IsNotEmpty({ message: 'CI no debe estar vacio' })
  ci: string;

  @IsString({ message: 'Password debe ser un string' })
  @IsNotEmpty({ message: 'Password no debe estar vacio' })
  password: string;

  @IsString({ message: 'Nombre debe ser un string' })
  @IsOptional()
  fullname?: string;
}
