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
import { configOptins, mailerOptions } from './configs';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserResumeModule } from './user-resume';
import { PaymentModule } from './payment';
import { UploadModule } from './upload';
import { SubscriptionModule } from './subscription';

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
    MailerModule.forRoot(mailerOptions),
    DbModule,
    AuthModule,
    PublicModule,
    UserModule,
    JobModule,
    CompanyModule,
    UserJobModule,
    UserResumeModule,
    PaymentModule,
    UploadModule,
    SubscriptionModule,
  ],
  providers: [{ provide: APP_PIPE, useClass: ZodValidationPipe }],
})
export class AppModule {}
