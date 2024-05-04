import { Module } from '@nestjs/common';
import { UserJobController } from './user-job.controller';
import { UserJobService } from './user-job.service';
import { PassportModule } from '@nestjs/passport';
import { jwtOptions, passportOptions } from 'src/configs';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategy';
import { DbService } from 'src/db';

@Module({
  imports: [PassportModule.register(passportOptions), JwtModule.register(jwtOptions)],
  controllers: [UserJobController],
  providers: [UserJobService, JwtStrategy, DbService],
})
export class UserJobModule {}
