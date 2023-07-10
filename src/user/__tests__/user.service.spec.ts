import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UserService } from '@/user/user.service';

import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';
import { ResponseStatusDto } from '@/commons/dto/ResponseStatus.dto';

describe('UserService', () => {
  let service: UserService;
  let findManyMok: jest.Mock;
  let findUniqueMok: jest.Mock;
  let createMock: jest.Mock;
  let updateMock: jest.Mock;
  let deleteMock: jest.Mock;
  let changeRoleMok: jest.Mock;

  beforeEach(async () => {
    findManyMok = jest.fn();
    createMock = jest.fn();
    findUniqueMok = jest.fn();
    updateMock = jest.fn();
    deleteMock = jest.fn();
    changeRoleMok = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: findManyMok,
              create: createMock,
              update: updateMock,
              delete: deleteMock,
              findUnique: findUniqueMok,
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when the register method is called', () => {
    describe('and the user data is correct', () => {
      it('should create a user and return the user', async () => {
        createMock.mockResolvedValue({
          id: '1123',
          ci: '4197191',
          password: '124',
        });
        const res = await service.create({ ci: '4197191', password: '124' });
        expect(createMock).toBeCalled();
        expect(res).toEqual({
          id: '1123',
          ci: '4197191',
          password: '124',
        });
      });
    });
    describe('and the user already exist', () => {
      it('should throw a BadRequestException', async () => {
        createMock.mockRejectedValue(
          new Prisma.PrismaClientKnownRequestError('', {
            code: 'P2002',
            clientVersion: '1',
          }),
        );
        try {
          await service.create({ ci: '4197191', password: '124' });
        } catch (error) {
          expect(createMock).toBeCalled();
          expect(error).toEqual(new BadRequestException('Invalid credentials'));
        }
      });
    });
  });

  describe('when the findAll method is called', () => {
    it('should return the list of users', async () => {
      findManyMok.mockResolvedValue([
        { id: 1, ci: '1234' },
        { id: 1, ci: '1234' },
      ]);
      const res = await service.findAll({});
      expect(findManyMok).toBeCalled();
      expect(res).toEqual([
        { id: 1, ci: '1234' },
        { id: 1, ci: '1234' },
      ]);
    });
  });

  describe('when the findOne method is called', () => {
    it('should return the user by id', async () => {
      findUniqueMok.mockResolvedValue({ id: 1, ci: '1234' });
      const res = await service.findOne('1234');
      expect(findUniqueMok).toBeCalled();
      expect(res).toEqual({ id: 1, ci: '1234' });
    });
  });

  describe('when the findByCi method is called', () => {
    it('should return the user by ci', async () => {
      findUniqueMok.mockResolvedValue({ id: 1, ci: '1234' });
      const res = await service.findByCi('1234');
      expect(findUniqueMok).toBeCalled();
      expect(res).toEqual({ id: 1, ci: '1234' });
    });
  });

  describe('when the update method is called', () => {
    it('should return the user updated', async () => {
      updateMock.mockResolvedValue({ id: 1, ci: '1234', fullname: 'new Name' });
      const res = await service.update('124', {
        ci: '1234',
        fullname: 'Old Name',
      });
      expect(updateMock).toBeCalled();
      expect(res).toEqual({ id: 1, ci: '1234', fullname: 'new Name' });
    });
  });

  describe('when the delete method is called', () => {
    it('should return Response status dto', async () => {
      const deleteResponse =
        ResponseStatusDto.getNoContentResponse('Usuario eliminado');
      deleteMock.mockResolvedValue(deleteResponse);
      const res = await service.delete('124');
      expect(deleteMock).toBeCalled();
      expect(res).toEqual(deleteResponse);
    });
  });

  describe('when the change role method is called', () => {
    describe('and the new Role is User', () => {
      it('should change the role to USER', async () => {
        const newRole: Role = 'USER';
        const id = '1234';
        updateMock.mockReturnValue({ id: '1234', role: newRole });
        const res = await service.changeRole(id, { role: newRole });
        expect(updateMock).toBeCalled();
        expect(res).toEqual({ id: '1234', role: newRole });
      });
    });
  });
});
