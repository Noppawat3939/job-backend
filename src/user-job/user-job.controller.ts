import { Controller, Get, Param, Post, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { JwtAuthGuard, RolesGuard } from 'src/guards';
import { UserJobService } from './user-job.service';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('user-job')
export class UserJobController {
  constructor(private readonly service: UserJobService) {}

  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.user])
  @Get('/applied')
  appliesJobs(@Req() req: Request) {
    const user = req.user as User;

    return this.service.getAppliedJobs(user.id);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.user])
  @Post('/apply/:id')
  applyJob(@Param() { id }: { id: string }, @Req() req: Request) {
    const user = req.user as User;

    return this.service.applyJob(+id, user.id);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.user])
  @Post('/cancel/:id')
  cancelJob(@Param() { id }: { id: string }, @Req() req: Request) {
    const user = req.user as User;

    return this.service.cancelJob(+id, user.id);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.admin])
  @Post('/update/:id')
  updateStatus(@Param() { id }: { id: string }) {
    return this.service.updateStatusApplication(+id);
  }
}
