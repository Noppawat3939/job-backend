import { Injectable } from '@nestjs/common';
import { accepts, createQRPromptpay, exceptions, generateRefNo } from 'src/lib';
import { MESSAGE } from 'src/constants';
import { Prisma, TransactionStatus, User } from '@prisma/client';
import type { CreateQRSourceDto } from 'src/types';
import dayjs from 'dayjs';
import { DbService } from 'src/db';
import { SUBSCRIBE_DATA } from 'src/public/data';

@Injectable()
export class PaymentService {
  constructor(private readonly db: DbService) {}
  async createQRSource(user: User, dto: CreateQRSourceDto) {
    const subscribed = await this.db.subscription.findUnique({
      where: { userEmail: user.email },
    });

    if (subscribed?.userEmail)
      return exceptions.unProcessable(`Email ${user.email} already subscribed`);

    const price = SUBSCRIBE_DATA.find((data) => data.code_key === dto.code_key).price[dto.period];

    createQRPromptpay(price);

    return accepts(MESSAGE.CREATE_SUCCESS, {
      data: {
        refNo: generateRefNo(),
        qrcode: createQRPromptpay(price),
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

  async createTransaction(user: User, refNumber: string) {
    const transaction = await this.db.paymentTransaction.findFirst({
      where: { refNumber, stamptUserId: user.id },
    });

    if (transaction) return exceptions.unProcessable(MESSAGE.NOT_ACCEPT);

    const data = await this.db.paymentTransaction.create({
      data: {
        refNumber,
        stamptUserId: user.id,
      },
    });

    return accepts(MESSAGE.CREATE_SUCCESS, { data });
  }

  async updateTransaction(user: User, refNumber: string, dto: { status: TransactionStatus }) {
    if (dto.status === 'pending') {
      return exceptions.unProcessable(MESSAGE.NOT_ACCEPT);
    }

    await this.db.paymentTransaction
      .findUniqueOrThrow({ where: { refNumber, status: TransactionStatus.pending } })
      .then(async (result) => {
        if (result.refNumber) {
          await this.db.paymentTransaction
            .update({
              where: { refNumber: result.refNumber },
              data: { stamptUserId: user.id, status: dto.status },
            })
            .then((data) => accepts(MESSAGE.UPDATE_SUCCESS, { data }))
            .catch(() => {
              exceptions.badRequest(MESSAGE.UPDATE_FAILED);
            });
        }
      })
      .catch(() => exceptions.badRequest(MESSAGE.NOT_FOUND));
  }
}
