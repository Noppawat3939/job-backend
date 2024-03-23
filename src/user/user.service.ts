import type { QueryApproveUsers } from 'src/types';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { MESSAGE } from 'src/constants';
import { DbService } from 'src/db';
import { accepts, eq, exclude } from 'src/lib';

@Injectable()
export class UserService {
  constructor(private readonly db: DbService) {}

  async getUsers(query?: QueryApproveUsers) {
    const filter = {
      ...(eq(query, 'approved') && { AND: { active: true } }),
      ...(eq(query, 'un_approve') && { AND: { active: null } }),
      ...(eq(query, 'rejected') && { NOT: { active: false } }),
    };

    const users = await this.db.user.findMany({
      where: filter,
      orderBy: { id: 'asc' },
    });

    const excluded = exclude(users, ['password', 'active', 'updatedAt']);

    return accepts(MESSAGE.GETTED_USERS, {
      data: excluded,
      total: excluded.length,
    });
  }

  getMe(user: User) {
    return accepts(MESSAGE.GETTED_USERS, { data: user });
  }
}
