import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';

import { UpdateUserDto } from './dto/update-user.dto';

import { Role } from '@prisma/client';

import { Auth } from '@/auth/decorators';
import { MongoIdPipe } from '@/commons/pipes/mongo-id.pipe';
import { User } from '@/commons/prisma-models/user';
import { ChangeRoleDto } from './dto/change-role.dto';
import { ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseStatusDto } from '@/commons/dto/ResponseStatus.dto';
import { PaginationDto } from '@/commons/dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth(Role.ADMIN)
  @ApiOkResponse({
    description: 'User list',
    type: User,
    isArray: true,
  })
  findAll(@Query() pagination: PaginationDto): Promise<User[]> {
    return this.userService.findAll(pagination);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'User with id = {id}',
    type: User,
  })
  @Auth(Role.ADMIN, Role.USER)
  async findOne(@Param('id', MongoIdPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Auth(Role.ADMIN)
  @ApiOkResponse({
    description: 'User with id = {id} modified',
    type: User,
  })
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'Usuario eliminado',
    type: ResponseStatusDto<null>,
  })
  remove(@Param('id') id: string) {
    return this.userService.delete(id);
  }

  @Patch(':id/change-role')
  @Auth(Role.ADMIN)
  @ApiOkResponse({
    description: 'Users role with id = {id}  modified',
    type: User,
  })
  changeRole(
    @Param('id', MongoIdPipe) id: string,
    @Body() changeRoleDto: ChangeRoleDto,
  ) {
    return this.userService.changeRole(id, changeRoleDto);
  }
}
