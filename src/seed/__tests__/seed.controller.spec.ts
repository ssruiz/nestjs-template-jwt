import { Test, TestingModule } from '@nestjs/testing';
import { SeedController } from '../seed.controller';
import { SeedService } from '../seed.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { SeedModule } from '../seed.module';
import { PrismaService } from '@/prisma/prisma.service';
import { ResponseStatusDto } from '@/commons/dto';

describe('SeedController', () => {
  let controller: SeedController;
  let countMok: jest.Mock;
  let createMock: jest.Mock;

  beforeEach(async () => {
    countMok = jest.fn();
    createMock = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeedController],
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

    controller = module.get<SeedController>(SeedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should populated db if is empty', async () => {
    countMok.mockResolvedValue(0);

    const rest = await controller.seedDB();
    expect(rest).toEqual(
      ResponseStatusDto.getNoContentResponse('DB populated!'),
    );
  });

  it('should no populate if db has data already', async () => {
    countMok.mockResolvedValue(1);

    const rest = await controller.seedDB();
    expect(rest).toEqual(
      ResponseStatusDto.getNoContentResponse('DB already populated'),
    );
  });
});
