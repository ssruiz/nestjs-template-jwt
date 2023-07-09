import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { hash, verify } from 'argon2';

import { CreateAuthDto } from './dto/create-auth.dto';

import { JWTPayload } from './interfaces/jwt-payload.interface';

import { UserService } from '@/user/user.service';
import { Prisma } from '@prisma/client';
import { PrismaException } from '@/commons/exceptions/prisma.exceptions';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    const password = await this.hashPassword(createAuthDto.password);

    try {
      const user = await this.userService.create({
        ...createAuthDto,
        password,
      });

      const payload: JWTPayload = { sub: user.id, ci: user.ci };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        PrismaException.returnMessage(error, `Invalid credentials`);
      }

      throw error;
    }
  }

  async login({
    ci,
    password,
  }: CreateAuthDto): Promise<{ access_token: string }> {
    try {
      const user = await this.userService.findByCi(ci);

      if (!user) throw new BadRequestException('Invalid credentials');

      if (!(await this.verifyPassword(user.password, password)))
        throw new BadRequestException('Invalid credentials');

      const payload: JWTPayload = { sub: user.id, ci: user.ci };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        PrismaException.returnMessage(error, `Invalid credentials`);
      }
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
