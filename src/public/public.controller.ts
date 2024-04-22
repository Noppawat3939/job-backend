import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PublicKeyGuard } from 'src/guards';
import { PublicService } from './public.service';
import { QueryPublicJobs } from 'src/types';

@Controller('public')
export class PublicController {
  constructor(private readonly service: PublicService) {}

  @UseGuards(PublicKeyGuard)
  @Get('industry')
  getAllIndustries() {
    return this.service.getAllIndustries();
  }

  @Get('province')
  getProvince() {
    return this.service.getProvince();
  }

  @UseGuards(PublicKeyGuard)
  @Get('job/list')
  getJobs(@Query() query: QueryPublicJobs) {
    return this.service.getJobs(query);
  }

  @UseGuards(PublicKeyGuard)
  @Get('job/:id')
  getJob(@Param() { id }: { id: string }) {
    return this.service.getJob(+id);
  }
}
