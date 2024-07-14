import { Inject, Injectable } from '@nestjs/common';
import { accepts, createQRPromptpay, eq, exceptions, generateRefNo } from 'src/lib';
import { CACHE_KEY, MESSAGE } from 'src/constants';
import {
  Prisma,
  SubscriptionStatus,
  SubscriptionType,
  TransactionStatus,
  User,
} from '@prisma/client';
import type { CreateQRSourceDto } from 'src/types';
import dayjs from 'dayjs';
import { DbService } from 'src/db';
import { SUBSCRIBE_DATA } from 'src/public/data';
import { CreatePaymentDto } from 'src/schemas';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class PaymentService {
  constructor(
    private readonly db: DbService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}
  async createQRSource(user: User, dto: CreateQRSourceDto) {
    const subscribed = await this.db.subscription.findFirst({
      where: { userId: user.id, status: { not: SubscriptionStatus.unsubscribe } },
    });

    if (subscribed) return exceptions.unProcessable(`Email ${user.email} already subscribed`);

    const { price, plan } = SUBSCRIBE_DATA.find((data) => data.code_key === dto.code_key);

    const refNumber = generateRefNo();

    createQRPromptpay(price[dto.period]);

    await this.cache.set(
      CACHE_KEY.REF_SUBPLAN,
      JSON.stringify({ [refNumber]: `sub_${plan.toUpperCase()}` }),
    );

    return accepts(MESSAGE.CREATE_SUCCESS, {
      data: {
        refNo: refNumber,
        qrcode: createQRPromptpay(price[dto.period]),
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

  async createTransaction(user: User, dto: CreatePaymentDto) {
    const { refNumber } = dto;

    let refSubPlan: Record<string, SubscriptionType>;

    const transaction = await this.db.paymentTransaction.findFirst({
      where: { OR: [{ refNumber }, { stamptUserId: user.id }] },
    });

    if (transaction) {
      console.log(`transaction already exits user ID ${transaction.stamptUserId}`);
      return exceptions.unProcessable(MESSAGE.NOT_ACCEPT);
    }

    const cachedRefSubPlan = await this.cache.get<string>(CACHE_KEY.REF_SUBPLAN);

    if (cachedRefSubPlan) {
      refSubPlan = JSON.parse(cachedRefSubPlan);
    }

    const [transactionResult] = await Promise.all([
      this.db.paymentTransaction.create({
        data: {
          refNumber,
          stamptUserId: user.id,
          ...(dto.slipImage && { slipImage: dto.slipImage }),
        },
      }),
      this.db.subscription.create({ data: { userId: user.id, type: refSubPlan[refNumber] } }),
    ]).finally(async () => await this.cache.del(CACHE_KEY.REF_SUBPLAN));

    return accepts(MESSAGE.CREATE_SUCCESS, { data: transactionResult });
  }

  async updateTransaction(user: User, refNumber: string, dto: { status: TransactionStatus }) {
    if (eq(dto.status, TransactionStatus.pending))
      return exceptions.unProcessable(MESSAGE.NOT_ACCEPT);

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
