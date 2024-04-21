import { Controller, Get, Post, Query, Req, SetMetadata, UseGuards, Param } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { Request } from 'express';
import { JwtAuthGuard, RolesGuard } from 'src/guards';
import { CompanyService } from './company.service';
import { QueryJobs } from 'src/types';

@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@SetMetadata('role', [Role.employer])
@Controller('company')
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @Get('list')
  getJobsByCompany(@Req() req: Request, @Query() query: Omit<QueryJobs, 'company'>) {
    const user = req.user as User;

    return this.service.getJobsByCompany(user.companyName, query);
  }

  @Post('job/open/:id') //TODO: added schema start and end time
  openJob(@Req() req: Request, @Param() { id }: { id: string }) {
    const user = req.user as User;
    return this.service.openJobByTimes(user.companyName, +id);
  }
}
