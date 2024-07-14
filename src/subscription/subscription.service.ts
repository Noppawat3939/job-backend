import { Injectable } from '@nestjs/common';
import { PaymentTransaction, Subscription, SubscriptionStatus, User } from '@prisma/client';
import { MESSAGE } from 'src/constants';
import { DbService } from 'src/db';
import { accepts } from 'src/lib';

@Injectable()
export class SubscriptionService {
  constructor(private readonly db: DbService) {}

  async getSubscriptions(query?: { status?: SubscriptionStatus }) {
    const queryStatus = query.status || SubscriptionStatus.pending;

    let data: {
      subscription: Omit<Subscription, 'userId'>;
      transaction: PaymentTransaction;
      user: Pick<User, 'email' | 'firstName' | 'lastName'>;
    }[] = [];

    const subscriptions = await this.db.subscription.findMany({
      where: { status: queryStatus },
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
}
