import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { DbService } from 'src/db';
import { JwtStrategy } from './strategy';
import { jwtOptions, passportOptions } from 'src/configs';
import { GoogleStrategy } from './strategy/google-oauth.strategy';

@Module({
  imports: [PassportModule.register(passportOptions), JwtModule.register(jwtOptions)],
  controllers: [AuthController],
  providers: [AuthService, DbService, JwtStrategy, GoogleStrategy],
})
export class AuthModule {}
