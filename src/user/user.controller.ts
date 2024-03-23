import { Controller, Get, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard, RolesGuard } from 'src/guards';
import { UserService } from './user.service';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('me')
  getMe(@Req() req: Request) {
    return this.service.getMe(req.user);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.super_admin])
  @Get('all')
  getUses() {
    return this.service.getUsers();
  }

  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.super_admin])
  @Get('un-approve')
  getUnApproveUsers() {
    return this.service.getUsers('un_approve');
  }

  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.super_admin])
  @Get('un-approve')
  getRejectedUsers() {
    return this.service.getUsers('rejected');
  }
}
