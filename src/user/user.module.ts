import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategy';
import { DbService } from 'src/db';
import { jwtOptions, passportOptions } from 'src/configs';

@Module({
  imports: [PassportModule.register(passportOptions), JwtModule.register(jwtOptions)],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, DbService],
})
export class UserModule {}
