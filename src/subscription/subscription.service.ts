import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import {
  PaymentTransaction,
  Subscription,
  SubscriptionStatus,
  TransactionStatus,
  User,
} from '@prisma/client';
import dayjs from 'dayjs';
import { MESSAGE } from 'src/constants';
import { DbService } from 'src/db';
import { accepts, exceptions, generateMailerOptions } from 'src/lib';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly db: DbService,
    private readonly mailer: MailerService,
  ) {}

  async getSubscriptions(query?: { status?: SubscriptionStatus[] }) {
    const queryStatus = query.status || [SubscriptionStatus.pending];

    let data: {
      subscription: Omit<Subscription, 'userId'>;
      transaction: PaymentTransaction;
      user: Pick<User, 'email' | 'firstName' | 'lastName'>;
    }[] = [];

    const subscriptions = await this.db.subscription.findMany({
      where: { status: { in: queryStatus } },
      orderBy: { createdAt: 'desc' },
    });

    for (let i = 0; i < subscriptions.length; i++) {
      const subscription = subscriptions[i];

      const [transaction, user] = await Promise.all([
        await this.db.paymentTransaction.findFirst({
          where: { stamptUserId: subscription.userId },
        }),
        await this.db.user.findFirst({
          where: { id: subscription.userId },
          select: { firstName: true, lastName: true, email: true },
        }),
      ]);

      delete subscription.userId;

      data.push({ subscription, transaction, user });
    }

    return accepts(MESSAGE.GET_SUCCESS, { data, total: data.length });
  }

  async confirmVerify(dto: { id: string; refNumber: string }) {
    const [subscription, paymentTransaction] = await Promise.all([
      this.db.subscription.findFirstOrThrow({
        where: { id: +dto.id },
        select: { userId: true, id: true },
      }),
      this.db.paymentTransaction.findFirstOrThrow({
        where: { refNumber: dto.refNumber },
        select: { id: true, refNumber: true },
      }),
    ]).catch(() => exceptions.badRequest(MESSAGE.NOT_FOUND));

    const [_subscribe, user, _transaction] = await Promise.all([
      this.db.subscription.update({
        where: { id: subscription.id },
        data: { status: SubscriptionStatus.subscribed },
      }),
      this.db.user.findFirst({
        where: { id: subscription.userId },
        select: { id: true, firstName: true, lastName: true, email: true },
      }),
      this.db.paymentTransaction.update({
        where: { id: paymentTransaction.id },
        data: {
          transactionCompletedAt: dayjs().toISOString(),
          status: TransactionStatus.completed,
        },
      }),
    ]);

    const mailerOption = generateMailerOptions({
      email: user.email,
      username: `${user.firstName || ''} ${user.lastName || ''}`,
    });

    this.mailer.sendMail(mailerOption.subscribe);

    return accepts(MESSAGE.UPDATE_SUCCESS);
  }

  async reject(refNumber: string) {
    await this.db.paymentTransaction.update({
      where: { refNumber },
      data: { status: TransactionStatus.cancelled },
    });

    return accepts(MESSAGE.UPDATE_SUCCESS);
  }
}
