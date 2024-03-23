import { Controller, Get } from '@nestjs/common';

@Controller('public')
export class PublicController {
  @Get('industry-list')
  getIndustryList() {
    return { message: 'ok' };
  }
}
