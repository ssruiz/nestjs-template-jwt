import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export class PrismaException {
  static returnMessage(
    error: Prisma.PrismaClientKnownRequestError,
    message?: string,
  ) {
    switch (error.code) {
      case 'P2002':
        throw new BadRequestException(message || 'Violate unique key');

      case 'P2025':
        throw new NotFoundException(message || `Not found`);
      default:
        throw new BadRequestException(message || 'Something went wrong');
    }
  }
}
