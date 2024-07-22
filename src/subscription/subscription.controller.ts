import { Body, Controller, Get, Post, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard, RolesGuard } from 'src/guards';
import { Role, SubscriptionStatus } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Subscripton')
@UseGuards(JwtAuthGuard)
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly service: SubscriptionService) {}

  @Get('/')
  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.admin, Role.super_admin])
  getSubscriptions(@Query() query: { status: SubscriptionStatus[] }) {
    return this.service.getSubscriptions(query);
  }

  @Post('/confirm-verify')
  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.admin, Role.super_admin])
  confirmVerify(@Body() dto: { id: string; refNumber: string }) {
    return this.service.confirmVerify(dto);
  }

  @Post('/reject')
  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.admin, Role.super_admin])
  reject(@Body() dto: { refNumber: string }) {
    return this.service.reject(dto.refNumber);
  }
}
