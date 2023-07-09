import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { CommonsModule } from './commons/commons.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommonsModule,
    AuthModule,
    UserModule,
    PrismaModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
