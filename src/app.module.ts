import { Module } from '@nestjs/common';
import { DbModule } from './db';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { PublicModule } from './public';
import { UserModule } from './user';
import { JobModule } from './job/job.module';
import { CompanyModule } from './company';
import { UserJobModule } from './user-job';
import { configOptins } from './configs';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

const { REDIS_HOST: redisHost, REDIS_PORT: redisPort, CACHE_TTL: cacheTtl } = process.env;

@Module({
  imports: [
    ConfigModule.forRoot(configOptins),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        ttl: +cacheTtl,
        store: await redisStore({
          socket: { host: redisHost, port: +redisPort },
        }),
      }),
    }),
    DbModule,
    AuthModule,
    PublicModule,
    UserModule,
    JobModule,
    CompanyModule,
    UserJobModule,
  ],
  providers: [{ provide: APP_PIPE, useClass: ZodValidationPipe }],
})
export class AppModule {}
