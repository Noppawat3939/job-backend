import { Module } from '@nestjs/common';
import { PublicService } from './public.service';
import { PublicController } from './public.controller';
import { HttpModule } from '@nestjs/axios';
import { DbService } from 'src/db';

@Module({
  imports: [HttpModule.register({ timeout: 10000, method: 'GET' })],
  providers: [PublicService, DbService],
  controllers: [PublicController],
})
export class PublicModule {}
