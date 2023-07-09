import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';

import { UpdateUserDto } from './dto/update-user.dto';

import { Role } from '@prisma/client';

import { Auth } from '@/auth/decorators';
import { MongoIdPipe } from '@/commons/pipes/mongo-id.pipe';
import { User } from '@/commons/prisma-models/user';
import { ChangeRoleDto } from './dto/change-role.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth(Role.ADMIN)
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @Auth(Role.ADMIN, Role.USER)
  async findOne(@Param('id', MongoIdPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Auth(Role.ADMIN)
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.userService.delete(id);
  }

  @Patch(':id/change-role')
  @Auth(Role.ADMIN)
  changeRole(
    @Param('id', MongoIdPipe) id: string,
    @Body() changeRoleDto: ChangeRoleDto,
  ) {
    return this.userService.changeRole(id, changeRoleDto);
  }
}
