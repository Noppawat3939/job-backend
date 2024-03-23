import { Module } from '@nestjs/common';
import { PublicService } from './public.service';
import { PublicController } from './public.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule.register({ timeout: 10000, method: 'GET' })],
  providers: [PublicService],
  controllers: [PublicController],
})
export class PublicModule {}
