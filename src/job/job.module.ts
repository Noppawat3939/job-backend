import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { DbService } from 'src/db';
import { jwtOptions, passportOptions } from 'src/options';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategy';

@Module({
  imports: [PassportModule.register(passportOptions), JwtModule.register(jwtOptions)],
  controllers: [JobController],
  providers: [JobService, JwtStrategy, DbService],
})
export class JobModule {}
