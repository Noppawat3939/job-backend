import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { JwtAuthGuard, RolesGuard } from 'src/guards';
import { UserJobService } from './user-job.service';
import { Request } from 'express';
import { HttpStatusCode } from 'axios';

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
  @HttpCode(HttpStatusCode.Ok)
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
  @SetMetadata('role', [Role.user])
  @Get('/favorited')
  favoritedJobs(@Req() req: Request) {
    const user = req.user as User;

    return this.service.getFavoriteJobs(user.id);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.user])
  @HttpCode(HttpStatusCode.Ok)
  @Post('/favorite/:id')
  favoriteJob(@Param() { id }: { id: string }, @Req() req: Request) {
    const user = req.user as User;

    return this.service.favoriteJob(+id, user.id);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.admin])
  @Post('/update/:id')
  updateStatus(@Param() { id }: { id: string }) {
    return this.service.updateStatusApplication(+id);
  }
}
