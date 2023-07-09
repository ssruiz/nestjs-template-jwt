import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from '../auth.service';
import { UserService } from '@/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import * as argon from 'argon2';

jest.mock('argon2');
const verifyMock = argon.verify as jest.Mock;

describe('AuthService', () => {
  let service: AuthService;
  let findByCiMok: jest.Mock;
  let jwtSignAsyncMok: jest.Mock;
  let createMock: jest.Mock;

  beforeEach(async () => {
    findByCiMok = jest.fn();
    createMock = jest.fn();
    jwtSignAsyncMok = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jwtSignAsyncMok,
          },
        },
        {
          provide: UserService,
          useValue: {
            create: createMock,
            findByCi: findByCiMok,
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when the register method is called', () => {
    describe('and the user data is correct', () => {
      it('should create a user and return a token', async () => {
        createMock.mockResolvedValue({ ci: '4197191', password: '124' });
        jwtSignAsyncMok.mockReturnValue('123132312312');
        const res = await service.register({ ci: '4197191', password: '124' });
        expect(createMock).toBeCalled();
        expect(jwtSignAsyncMok).toBeCalled();
        expect(res).toEqual({ access_token: '123132312312' });
      });
    });

    describe('and the user data is incorrect', () => {
      it('should no create a user and throw an error', async () => {
        createMock.mockRejectedValue(
          new BadRequestException('User already exists'),
        );
        jwtSignAsyncMok.mockReturnValue('123132312312');
        try {
          const res = await service.register({
            ci: '4197191',
            password: '124',
          });

          expect(res).rejects.toThrow(BadRequestException);
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
          expect(createMock).toBeCalled();
          expect(jwtSignAsyncMok).not.toBeCalled();
        }
      });
    });
  });

  describe('when the login method is called', () => {
    describe('and the user data is correct', () => {
      it('should return a token', async () => {
        findByCiMok.mockResolvedValue({
          id: '64a86cd80db56e1fccd06892',
          ci: '4197191',
          password: '1234',
        });
        verifyMock.mockReturnValue(true);
        jwtSignAsyncMok.mockReturnValue('123132312312');
        const res = await service.login({ ci: '4197191', password: '1234' });
        expect(findByCiMok).toBeCalled();
        expect(jwtSignAsyncMok).toBeCalled();
        expect(res).toEqual({ access_token: '123132312312' });
      });
    });

    describe('and the user data is not incorrect', () => {
      it('should throw an error', async () => {
        findByCiMok.mockResolvedValue(null);
        jwtSignAsyncMok.mockReturnValue('123132312312');

        try {
          await service.login({
            ci: '4197191',
            password: '124',
          });
        } catch (error) {
          expect(error).toEqual(new BadRequestException('Invalid credentials'));

          expect(findByCiMok).toBeCalled();
          expect(jwtSignAsyncMok).not.toBeCalled();
        }
      });
    });
  });
});
