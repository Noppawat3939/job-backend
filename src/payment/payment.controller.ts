import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import type { CreateQRSourceDto } from 'src/types';
import { Request } from 'express';
import { Role, TransactionStatus, User } from '@prisma/client';
import { JwtAuthGuard, RolesGuard } from 'src/guards';

@UseGuards(JwtAuthGuard)
@Controller('payment')
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @Post('/source-qr')
  generate(@Req() req: Request, @Body() dto: CreateQRSourceDto) {
    const user: User = req.user;

    return this.service.createQRSource(user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.super_admin, Role.admin])
  @Get('/transaction/list')
  getTransactions(@Query() query: { status: TransactionStatus | TransactionStatus[] }) {
    return this.service.getTransactionList(query);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.super_admin, Role.admin])
  @Post('/transaction/create/:refno')
  createTransaction(
    @Req() req: Request,
    @Param() { refno }: { refno: string },
    @Body() dto: { status: TransactionStatus },
  ) {
    const user: User = req.user;
    return this.service.createTransaction(user, refno);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @SetMetadata('role', [Role.super_admin, Role.admin])
  @Post('/transaction/update/:refno')
  updateTransaction(
    @Req() req: Request,
    @Param() { refno }: { refno: string },
    @Body() dto: { status: TransactionStatus },
  ) {
    const user: User = req.user;
    return this.service.updateTransaction(user, refno, dto);
  }
}
