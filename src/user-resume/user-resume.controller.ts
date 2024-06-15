import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from 'src/guards';
import { UserResumeService } from './user-resume.service';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('user-resume')
export class UserResumeController {
  constructor(private readonly service: UserResumeService) {}

  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.user])
  @Get('/templates')
  getTemplates() {
    return { msg: 'OK' };
  }
}
