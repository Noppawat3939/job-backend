import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PassportModule } from '@nestjs/passport';
import { jwtOptions, passportOptions } from 'src/configs';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategy';
import { DbService } from 'src/db';

@Module({
  imports: [PassportModule.register(passportOptions), JwtModule.register(jwtOptions)],
  controllers: [PaymentController],
  providers: [PaymentService, JwtStrategy, DbService],
})
export class PaymentModule {}
