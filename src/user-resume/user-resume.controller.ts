import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  SetMetadata,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from 'src/guards';
import { UserResumeService } from './user-resume.service';
import { Role, User } from '@prisma/client';
import { ZodValidationPipe } from 'nestjs-zod';
import { UpdateResumeDto } from 'src/schemas';
import type { Request } from 'express';
import { HttpStatusCode } from 'axios';

@UseGuards(JwtAuthGuard)
@Controller('user-resume')
export class UserResumeController {
  constructor(private readonly service: UserResumeService) {}

  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.user])
  @Get('/templates')
  getTemplates() {
    return this.service.getTemplates();
  }

  @UseGuards(RolesGuard)
  @HttpCode(HttpStatusCode.Ok)
  @SetMetadata('role', [Role.user])
  @UsePipes(new ZodValidationPipe(UpdateResumeDto))
  @Post('/')
  insertResume(@Req() req: Request, @Body() body: UpdateResumeDto) {
    const user: User = req.user;

    return this.service.insertUserResume(user, body);
  }

  @UseGuards(RolesGuard)
  @HttpCode(HttpStatusCode.Ok)
  @SetMetadata('role', [Role.user])
  @UsePipes(new ZodValidationPipe(UpdateResumeDto))
  @Post('/:id')
  updateResume(
    @Req() req: Request,
    @Param() { id }: { id: string },
    @Body() body: UpdateResumeDto,
  ) {
    const user: User = req.user;

    return this.service.updateUserResume(+id, user, body);
  }

  @UseGuards(RolesGuard)
  @HttpCode(HttpStatusCode.Ok)
  @SetMetadata('role', [Role.user])
  @Post('/public/:id')
  publicResume(@Req() req: Request, @Param() { id }: { id: string }) {
    const user: User = req.user;

    return this.service.updatePublicUserResume(+id, user);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.user])
  @Delete('/public/:id')
  deleteResume(@Req() req: Request, @Param() { id }: { id: string }) {
    const user: User = req.user;

    return this.service.deleteUserResume(+id, user);
  }
}
