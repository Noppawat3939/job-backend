import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { PassportModule } from '@nestjs/passport';
import { jwtOptions, passportOptions } from 'src/configs';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategy';
import { DbService } from 'src/db';

@Module({
  imports: [PassportModule.register(passportOptions), JwtModule.register(jwtOptions)],
  controllers: [CompanyController],
  providers: [CompanyService, JwtStrategy, DbService],
})
export class CompanyModule {}
