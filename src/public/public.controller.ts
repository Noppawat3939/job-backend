import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PublicKeyGuard } from 'src/guards';
import { PublicService } from './public.service';

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

  @Get('job/:id')
  getJob(@Param() { id }: { id: string }) {
    return this.service.getJobById(+id);
  }

  @Get('testimonials')
  getTesimonials() {
    return this.service.getTesimonials();
  }
}
