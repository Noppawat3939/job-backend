import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { DbService } from 'src/db';
import { accepts, exclude } from 'src/lib';

@Injectable()
export class UserService {
  constructor(private readonly db: DbService) {}

  async getUsers(query?: 'approved' | 'un_approve' | 'rejected') {
    const filter = {
      ...(query === 'approved' && { AND: { active: true } }),
      ...(query === 'un_approve' && { AND: { active: null } }),
      ...(query === 'rejected' && { NOT: { active: false } }),
    };

    const users = await this.db.user.findMany({
      where: filter,
      orderBy: { id: 'asc' },
    });

    const excluded = exclude(users, ['password', 'active', 'updatedAt']);

    return accepts('Getted users data is successfully', {
      data: excluded,
      total: excluded.length,
    });
  }

  getMe(user: User) {
    return accepts('Getted user is successfully', { data: user });
  }
}
