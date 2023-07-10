import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@/prisma/prisma.service';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';
import { ChangeRoleDto } from '../dto/change-role.dto';
import { ResponseStatusDto } from '@/commons/dto/ResponseStatus.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, PrismaService, JwtService, ConfigService],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const dateNow: Date = new Date();
  const userStandarResponse = {
    id: '1234',
    ci: '1234',
    fullname: '1234',
    isActive: true,
    role: Role.USER,
    createdAt: dateNow,
    updatedAt: dateNow,
  };

  describe('when the findAll endpoint is called', () => {
    it('should return the user list', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockImplementation(async () => [userStandarResponse]);

      const res = await controller.findAll({});
      expect(res).toEqual([userStandarResponse]);
    });
  });

  describe('when the findOne endpoint is called', () => {
    it('should return the user', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(async () => userStandarResponse);

      const res = await controller.findOne('1234');
      expect(res).toEqual(userStandarResponse);
    });
  });

  describe('when the delete endpoint is called', () => {
    it('should return Reponse Status Not Content', async () => {
      const deleteResponse =
        ResponseStatusDto.getNoContentResponse('Usuario Eliminado');
      jest
        .spyOn(service, 'delete')
        .mockImplementation(async () => deleteResponse);

      const res = await controller.remove('1234');
      expect(res).toEqual(deleteResponse);
    });
  });

  describe('when the change role endpoint is called', () => {
    it('should return the user updated', async () => {
      jest
        .spyOn(service, 'changeRole')
        .mockImplementation(async () => userStandarResponse);

      const role: ChangeRoleDto = { role: 'USER' };
      const res = await controller.changeRole('1234', role);
      expect(res).toEqual(userStandarResponse);
    });
  });
});
