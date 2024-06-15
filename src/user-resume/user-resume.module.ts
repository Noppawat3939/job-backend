import { Module } from '@nestjs/common';
import { UserResumeController } from './user-resume.controller';
import { UserResumeService } from './user-resume.service';
import { PassportModule } from '@nestjs/passport';
import { jwtOptions, passportOptions } from 'src/configs';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategy';
import { DbService } from 'src/db';

@Module({
  imports: [PassportModule.register(passportOptions), JwtModule.register(jwtOptions)],
  controllers: [UserResumeController],
  providers: [UserResumeService, JwtStrategy, DbService],
})
export class UserResumeModule {}
