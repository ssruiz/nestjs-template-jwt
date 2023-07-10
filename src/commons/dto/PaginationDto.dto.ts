import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    default: 10,
    description: 'Number of rows to fetch',
    required: false,
  })
  @IsOptional()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    default: 0,
    description: 'Number of rows to skip',
    required: false,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  offset?: number;
}
