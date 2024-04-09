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
import { Request } from 'express';
import { JwtAuthGuard, RolesGuard } from 'src/guards';
import { UserService } from './user.service';
import { Role } from '@prisma/client';
import { ZodValidationPipe } from 'nestjs-zod';
import {
  UpdateCompanyInfoDto,
  UpdateEmailDto,
  UpdateUserInfoDto,
  updateCompanyInfoSchema,
  updateEmailSchema,
  updateUserInfoSchema,
} from 'src/schemas';
import { ACTIVE } from 'src/constants';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('me')
  getMe(@Req() req: Request) {
    return this.service.getMe(req.user);
  }

  @Post('update')
  @UsePipes(new ZodValidationPipe(updateUserInfoSchema))
  updateUserInfo(@Req() req: Request, @Body() body: UpdateUserInfoDto) {
    return this.service.updateUserInfo(req.user, body);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.employer])
  @Post('update-company')
  @UsePipes(new ZodValidationPipe(updateCompanyInfoSchema))
  updateCompanyInfo(@Req() req: Request, @Body() body: UpdateCompanyInfoDto) {
    return this.service.updateUserInfo(req.user, body);
  }

  @Post('update-email')
  @UsePipes(new ZodValidationPipe(updateEmailSchema))
  updateEmailUser(@Req() req: Request, @Body() body: UpdateEmailDto) {
    const userId = +req.user.id;

    return this.service.updateEmail(userId, body);
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
    return this.service.getUsers(ACTIVE.UN_APPROVE);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.super_admin])
  @Get('un-approve')
  getRejectedUsers() {
    return this.service.getUsers(ACTIVE.REJECTED);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.super_admin])
  @Patch('approve/:id')
  approveUser(@Param() { id }: { id: string }) {
    return this.service.approveOrRejectUser(+id, ACTIVE.APPROVED);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.super_admin])
  @Patch('reject/:id')
  rejectUser(@Param() { id }: { id: string }) {
    return this.service.approveOrRejectUser(+id, ACTIVE.REJECTED);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.super_admin])
  @Patch('un-approve/:id')
  unApproveUser(@Param() { id }: { id: string }) {
    return this.service.approveOrRejectUser(+id, ACTIVE.UN_APPROVE);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.super_admin])
  @Delete('delete/:id')
  deleteUser(@Param() { id }: { id: string }) {
    return this.service.deleteUser(+id);
  }
}
