import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { hash, verify } from 'argon2';

import { CreateAuthDto } from './dto/create-auth.dto';

import { JWTPayload } from './interfaces/jwt-payload.interface';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    const password = await this.hashPassword(createAuthDto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          ...createAuthDto,
          password,
        },
      });

      const payload: JWTPayload = { sub: user.id, ci: user.ci };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {}
  }

  async login({ ci, password }: CreateAuthDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          ci,
        },
      });

      if (!user) throw new BadRequestException('Invalid credentials');

      if (!(await this.verifyPassword(user.password, password)))
        throw new BadRequestException('Invalid credentials');

      const payload: JWTPayload = { sub: user.id, ci: user.ci };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw error;
    }
  }

  async hashPassword(password: string): Promise<string> {
    return hash(password);
  }

  async verifyPassword(
    hashedPassword: string,
    password: string,
  ): Promise<boolean> {
    return await verify(hashedPassword, password);
  }
}
