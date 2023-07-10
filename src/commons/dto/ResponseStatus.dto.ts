import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseStatusDto<T> {
  @ApiProperty()
  status: HttpStatus;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: T;

  static getNoContentResponse(message: string): ResponseStatusDto<null> {
    return { message, data: null, status: HttpStatus.NO_CONTENT };
  }
}
