import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from '../seed.service';

import { PrismaService } from '@/prisma/prisma.service';

describe('SeedService', () => {
  let service: SeedService;
  let countMok: jest.Mock;
  let createMock: jest.Mock;
  beforeEach(async () => {
    countMok = jest.fn();
    createMock = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              count: countMok,
              create: createMock,
            },
          },
        },
      ],
    }).compile();

    service = module.get<SeedService>(SeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when the seed method is called', () => {
    describe('and the db already populate', () => {
      it('should no populate and return', async () => {
        countMok.mockResolvedValue(1);
        const res = await service.seedDB();
        expect(countMok).toBeCalled();
        expect(createMock).not.toBeCalled();
        expect(res).toEqual({ message: 'DB already populated' });
      });
    });

    describe('and the db is not populate', () => {
      it('should populate the db return', async () => {
        countMok.mockResolvedValue(0);
        const res = await service.seedDB();
        expect(countMok).toBeCalled();
        expect(createMock).toBeCalled();
        expect(res).toEqual({ message: 'DB populated!' });
      });
    });
  });
});
