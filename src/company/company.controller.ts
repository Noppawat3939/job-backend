import { Controller, Get, Param, Query, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { Request } from 'express';
import { JwtAuthGuard, RolesGuard } from 'src/guards';
import { CompanyService } from './company.service';
import { QueryJobs } from 'src/types';

@UseGuards(JwtAuthGuard)
@Controller('company')
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.employer])
  @Get('list')
  getJobsByCompany(@Req() req: Request, @Query() query: Omit<QueryJobs, 'company'>) {
    const user = req.user as User;

    return this.service.getJobsByCompany(user.companyName, query);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.employer])
  @Get('list/applied')
  getJobsApplied(@Req() req: Request) {
    const user = req.user as User;

    return this.service.getListApplied(user.companyName);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.employer])
  @Get('list/applied/:id')
  getJobsAppliedById(@Req() req: Request, @Param() { id }: { id: string }) {
    const user = req.user as User;

    return this.service.getJobsAppliedById(user.companyName, +id);
  }
}
