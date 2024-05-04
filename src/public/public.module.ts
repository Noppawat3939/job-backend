import { Module } from '@nestjs/common';
import { PublicService } from './public.service';
import { PublicController } from './public.controller';
import { HttpModule } from '@nestjs/axios';
import { DbService } from 'src/db';
import { httpGetOptions } from 'src/configs';

@Module({
  imports: [HttpModule.register(httpGetOptions)],
  providers: [PublicService, DbService],
  controllers: [PublicController],
})
export class PublicModule {}
