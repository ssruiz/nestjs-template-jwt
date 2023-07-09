import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class SeedService {
  constructor(private readonly prisma: PrismaService) {}

  async seedDB() {
    const userCount = await this.prisma.user.count();

    if (userCount > 0) return { message: 'DB already populated' };
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

    return { message: 'DB populated!' };
  }
}
