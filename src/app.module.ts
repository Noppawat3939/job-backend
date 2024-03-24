import { Module } from '@nestjs/common';
import { DbModule } from './db';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { PublicModule } from './public';
import { UserModule } from './user';
import { JobModule } from './job/job.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    AuthModule,
    PublicModule,
    UserModule,
    JobModule,
  ],
  providers: [{ provide: APP_PIPE, useClass: ZodValidationPipe }],
})
export class AppModule {}
