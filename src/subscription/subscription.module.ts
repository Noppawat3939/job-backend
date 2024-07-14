import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { PassportModule } from '@nestjs/passport';
import { jwtOptions, passportOptions } from 'src/configs';
import { JwtModule } from '@nestjs/jwt';
import { DbService } from 'src/db';
import { JwtStrategy } from 'src/auth/strategy';

@Module({
  imports: [PassportModule.register(passportOptions), JwtModule.register(jwtOptions)],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, JwtStrategy, DbService],
})
export class SubscriptionModule {}
