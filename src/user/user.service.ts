import type { QueryApproveUsers } from 'src/types';
import { Injectable } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { MESSAGE } from 'src/constants';
import { DbService } from 'src/db';
import { accepts, checkLastUpdated, compareHash, eq, exceptions, exclude } from 'src/lib';
import { UpdateCompanyInfoDto, UpdateEmailDto, UpdateUserInfoDto } from 'src/schemas';

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

  async approveOrRejectUser(id: number, action: 'approved' | 'rejected') {
    await this.db.user
      .findFirstOrThrow({ where: { id } })
      .catch(() => exceptions.badRequest(MESSAGE.USER_NOT_FOUND));

    const isApproved = action === 'approved';

    await this.db.user.update({ where: { id }, data: { active: isApproved } });

    return accepts(isApproved ? MESSAGE.USER_APPROVED : MESSAGE.USER_REJECTED);
  }

  async deleteUser(id: number) {
    await this.db.user
      .findFirstOrThrow({ where: { id } })
      .catch(() => exceptions.badRequest(MESSAGE.USER_NOT_FOUND));

    await this.db.user.delete({ where: { id } });

    return accepts(MESSAGE.USER_DELETED);
  }

  async updateEmail(id: number, dto: UpdateEmailDto) {
    const user = await this.db.user.findFirst({
      where: { id },
      select: { password: true, id: true, updatedAt: true },
    });

    const matched = await compareHash(dto.password, user.password);

    if (!matched) return exceptions.badRequest(MESSAGE.PASSWORD_INVALID);

    checkLastUpdated(-30, user.updatedAt);

    await this.db.user.update({ where: { id: user.id }, data: { email: dto.email } });

    return accepts(MESSAGE.EMAIL_UPDATED);
  }

  async updateCompanyInfo(user: User, dto: UpdateCompanyInfoDto) {
    const update = {
      ...(dto.companyName && { companyName: dto.companyName }),
      ...(dto.industry && { industry: dto.industry }),
    };

    checkLastUpdated(-10, user.updatedAt);

    await this.db.user.update({ where: { id: user.id }, data: update });

    return accepts(MESSAGE.COMPANY_INFO_UPDATED);
  }

  async updateUserInfo(user: User, dto: UpdateUserInfoDto & UpdateCompanyInfoDto) {
    let data: object;

    checkLastUpdated(-10, user.updatedAt);

    if (eq(user.role, Role.employer)) {
      const updatedCompany = {
        companyName: dto.companyName || user.companyName,
        industry: dto.industry || user.industry,
      };

      data = updatedCompany;
    } else {
      const updatedNotCompany = {
        firstName: dto.firstName || user.firstName,
        lastName: dto.lastName || user.lastName,
      };

      data = updatedNotCompany;
    }

    await this.db.user.update({ where: { id: user.id }, data });

    return accepts(MESSAGE.USER_INFO_UPDATED);
  }
}
