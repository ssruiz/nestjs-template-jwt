import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@/commons/prisma-models/user';
import { Prisma, Role } from '@prisma/client';
import { PrismaException } from '@/commons/exceptions/prisma.exceptions';
import { ChangeRoleDto } from './dto/change-role.dto';
import { ResponseStatusDto } from '@/commons/dto/ResponseStatus.dto';
import { PaginationDto } from '@/commons/dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        PrismaException.returnMessage(error, `Invalid credentials`);
      }
      throw error;
    }
  }

  async findAll({ limit, offset }: PaginationDto) {
    return await this.prisma.user.findMany({
      take: limit,
      skip: offset,
      select: {
        ci: true,
        fullname: true,
        isActive: true,
        id: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        isActive: true,
        id: true,
        fullname: true,
        ci: true,
        role: true,
      },
    });
  }

  async findByCi(ci: string) {
    return this.prisma.user.findUnique({
      where: {
        ci,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const userUpdate = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...updateUserDto,
      },
    });

    return userUpdate;
  }

  async delete(id: string): Promise<ResponseStatusDto<null>> {
    await this.prisma.user.delete({
      where: { id },
      select: {
        isActive: true,
        id: true,
        fullname: true,
        ci: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return ResponseStatusDto.getNoContentResponse('Usuario eliminado');
  }

  async changeRole(id: string, { role }: ChangeRoleDto) {
    return await this.prisma.user.update({
      where: { id },
      data: {
        role,
      },
      select: {
        isActive: true,
        id: true,
        fullname: true,
        ci: true,
        role: true,
      },
    });
  }
}
