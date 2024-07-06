import { Injectable } from '@nestjs/common';
import generatePayload from 'promptpay-qr';
import fs from 'fs';
import qrcode from 'qrcode';
import { ConfigService } from '@nestjs/config';
import { accepts, exceptions, generateRefNo } from 'src/lib';
import { MESSAGE } from 'src/constants';
import { Prisma, TransactionStatus, User } from '@prisma/client';
import type { CreateQRSourceDto } from 'src/types';
import dayjs from 'dayjs';
import { DbService } from 'src/db';

@Injectable()
export class PaymentService {
  constructor(
    private readonly config: ConfigService,
    private readonly db: DbService,
  ) {}
  async createQRSource(user: User, dto: CreateQRSourceDto) {
    let qr: string;

    // const subscribed = await this.db.subscription.findUnique({
    //   where: { userEmail: user.email || '' },
    // });

    const paymentTarget = this.config.get<string>('PROPMTPAY_MOBILE_NUMBER');

    const payload = generatePayload(paymentTarget, { amount: dto.value });

    qrcode.toString(
      payload,
      { type: 'svg', color: { dark: '#111111', light: '#fff' } },
      (err, qrSvgStr) => {
        if (err) return console.log(err);

        qr = qrSvgStr;
      },
    );

    return accepts(MESSAGE.CREATE_SUCCESS, {
      data: {
        refNo: generateRefNo(),
        qrcode: qr,
        expired_in: dayjs().add(10, 'minutes').toISOString(),
      },
    });
  }

  async getTransactionList(query?: { status: TransactionStatus | TransactionStatus[] }) {
    const filter = {} as Prisma.PaymentTransactionWhereInput;

    if (query.status) {
      filter['status'] = { in: Array.isArray(query.status) ? query.status : [query.status] };
    }

    const data = await this.db.paymentTransaction.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
    });

    return accepts(MESSAGE.GET_SUCCESS, { data });
  }

  async updateTransaction(user: User, refNumber: string, dto: { status: TransactionStatus }) {
    if (dto.status === 'pending') {
      return exceptions.unProcessable(MESSAGE.NOT_ACCEPT);
    }

    await this.db.paymentTransaction
      .findUniqueOrThrow({ where: { refNumber, status: TransactionStatus.pending } })
      .then(async (result) => {
        if (result.refNumber) {
          await this.db.paymentTransaction.update({
            where: { refNumber: result.refNumber },
            data: { stamptUserId: user.id, status: TransactionStatus[''] },
          });
        }
      })
      .catch(() => exceptions.badRequest(MESSAGE.NOT_FOUND));
  }
}
