import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import * as pactum from 'pactum';
import { CreateAuthDto } from '@/auth/dto/create-auth.dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    app.setGlobalPrefix('api');
    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333/api');
  });

  afterAll(async () => {
    console.log('Closing server');
    await app.close(); // <------------- THE PROBLEM ARISES HERE.
  });

  describe('Seed', () => {
    it('should populate the db', () => {
      return pactum.spec().get('/seed').expectStatus(200);
    });
  });

  describe('Auth', () => {
    describe('Register Users', () => {
      const dto: CreateAuthDto = {
        ci: '4197191',
        password: '1234',
        fullname: 'Samuel R',
      };

      it('should throw if no password was provided', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({ ci: '4197191' })
          .expectStatus(400);
      });

      it('should throw if no ci was provided', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({ password: '4197191' })
          .expectStatus(400);
      });

      it('should register the user', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody(dto)
          .expectStatus(201);
      });

      it('should throw if the user already exists', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody(dto)
          .expectStatus(400);
      });
    });

    describe('Login User', () => {
      const dto: CreateAuthDto = {
        ci: '4197191',
        password: '1234',
      };

      it('should throw if no password was provide', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ ci: '4197191' })
          .expectStatus(400);
      });

      it('should throw if no ci was provide', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ password: '4197191' })
          .expectStatus(400);
      });

      it('should throw for invalid password', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ ci: '4197191', password: '2' })
          .expectStatus(400);
      });

      it('should throw if user is not registered', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ ci: '123', password: '1232' })
          .expectStatus(400);
      });

      it('should sigin the user', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(200);
      });
    });
  });
});
