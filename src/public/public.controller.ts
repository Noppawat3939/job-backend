import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PublicKeyGuard } from 'src/guards';
import { PublicService } from './public.service';
import { QueryPublicJobs } from 'src/types';

@UseGuards(PublicKeyGuard)
@Controller('public')
export class PublicController {
  constructor(private readonly service: PublicService) {}

  @Get('industry')
  getAllIndustries() {
    return this.service.getAllIndustries();
  }

  @Get('province')
  getProvince() {
    return this.service.getProvince();
  }

  @Get('job-categories')
  getJobCategories() {
    return this.service.getJobCateories();
  }

  @Get('job/list')
  getJobs(@Query() query: QueryPublicJobs) {
    return this.service.getJobs(query);
  }

  @Get('job/:id')
  getJob(@Param() { id }: { id: string }) {
    return this.service.getJob(+id);
  }
}
