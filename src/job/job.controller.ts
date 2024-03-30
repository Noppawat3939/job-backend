import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  SetMetadata,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JobService } from './job.service';
import { ZodValidationPipe } from 'nestjs-zod';
import { CreateJobDto, UpdateJobDto, createJobSchema, updateJobSchema } from 'src/schemas';
import { JwtAuthGuard, RolesGuard } from 'src/guards';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { ACTIVE } from 'src/constants';

@UseGuards(JwtAuthGuard)
@Controller('job')
export class JobController {
  constructor(private readonly service: JobService) {}

  @Get('list')
  getJobs() {
    return this.service.getAll();
  }

  @Get('list/:id')
  getJob(@Param() { id }: { id: string }) {
    return this.service.getById(+id);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.employer])
  @Post('create')
  @UsePipes(new ZodValidationPipe(createJobSchema))
  createJob(@Req() req: Request, @Body() body: CreateJobDto) {
    return this.service.createJob(body, req.user);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.employer])
  @Patch('update/:id')
  @UsePipes(new ZodValidationPipe(updateJobSchema))
  updateJob(@Req() req: Request, @Body() body: UpdateJobDto) {
    const id = Number(req.params.id);

    return this.service.updateJob(id, body);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.super_admin, Role.admin])
  @Patch('approve/:id')
  approveJob(@Param() { id }: { id: string }) {
    return this.service.approveOrRejectJob(+id, ACTIVE.APPROVED);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.super_admin])
  @Patch('reject/:id')
  rejectJob(@Param() { id }: { id: string }) {
    return this.service.approveOrRejectJob(+id, ACTIVE.REJECTED);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.super_admin])
  @Patch('un-approve/:id')
  unApproveJob(@Param() { id }: { id: string }) {
    return this.service.approveOrRejectJob(+id, ACTIVE.UN_APPROVE);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.employer, Role.super_admin])
  @Delete(':id')
  deleteJob(@Req() req: Request, @Param() { id }: { id: string }) {
    return this.service.deleteJob(+id, req.user);
  }
}
