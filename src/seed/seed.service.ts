import { ResponseStatusDto } from '@/commons/dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class SeedService {
  constructor(private readonly prisma: PrismaService) {}

  async seedDB(): Promise<ResponseStatusDto<null>> {
    const userCount = await this.prisma.user.count();

    if (userCount > 0)
      return ResponseStatusDto.getNoContentResponse('DB already populated');

    // Insert Users: Role User and Admin
    await this.prisma.user.create({
      data: {
        ci: 'admin',
        password: '1234',
        fullname: 'admin',
        role: 'ADMIN',
      },
    });

    await this.prisma.user.create({
      data: {
        ci: '4197197',
        password: '1234',
        fullname: 'Samuel R2.',
        role: 'USER',
      },
    });

    return ResponseStatusDto.getNoContentResponse('DB populated!');
  }
}
