import { Controller, Get, Query, SetMetadata, UseGuards } from '@nestjs/common';
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
  getSubscriptions(@Query() query: { status: SubscriptionStatus }) {
    return this.service.getSubscriptions(query);
  }
}
