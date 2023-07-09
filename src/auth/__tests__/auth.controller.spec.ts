import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@/prisma/prisma.service';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/user/user.service';
import { BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, JwtService, UserService, PrismaService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('When the user login with correct data', () => {
    it('should return a token', async () => {
      jest
        .spyOn(service, 'login')
        .mockImplementation(async () => ({ access_token: '1234' }));

      const res = await controller.login({ ci: '4197191', password: '1234' });
      expect(res).toEqual({ access_token: '1234' });
    });
  });

  describe('When the user login with inccorrect data', () => {
    it('should throw a new BadRequestException', async () => {
      jest.spyOn(service, 'login').mockImplementation(async () => {
        throw new BadRequestException();
      });

      try {
        await controller.login({ ci: '4197191', password: '1234' });
      } catch (error) {
        expect(error).toEqual(new BadRequestException());
      }
    });
  });
});
