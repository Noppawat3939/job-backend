import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PublicKeyGuard } from 'src/guards';
import { PublicService } from './public.service';

@Controller('public')
export class PublicController {
  constructor(private readonly service: PublicService) {}

  @UseGuards(PublicKeyGuard)
  @Get('industry')
  getIndustryList() {
    return this.service.getIndustries();
  }

  @Get('province')
  getProvince() {
    return this.service.getProvince();
  }

  @UseGuards(PublicKeyGuard)
  @Get('job/list')
  getJobs() {
    return this.service.getJobs();
  }

  @UseGuards(PublicKeyGuard)
  @Get('job/:id')
  getJob(@Param() { id }: { id: string }) {
    return this.service.getJob(+id);
  }
}
