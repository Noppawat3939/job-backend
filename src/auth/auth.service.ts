import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { MESSAGE } from 'src/constants';
import { DbService } from 'src/db';
import { accepts, checkLastUpdated, compareHash, exceptions, hash } from 'src/lib';
import {
  ForgotPasswordCompanyDto,
  ForgotPasswordUserWithAdminDto,
  SigninCompanyDto,
  SigninUserWithAdminDto,
  SignupCompanyDto,
  SignupUserWithAdminDto,
} from 'src/schemas';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DbService,
    private readonly jwt: JwtService,
  ) {}

  async signupUserWithAdmin(dto: SignupUserWithAdminDto, role: Role) {
    const user = await this.db.user.findFirst({
      where: { email: dto.email, role },
    });

    if (user) return exceptions.badRequest(MESSAGE.EMAIL_EXITS);

    const password = await hash(dto.password);

    await this.db.user.create({
      data: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        password,
        role,
      },
    });

    return accepts(MESSAGE.USER_CREATED);
  }

  async signupCompany(dto: SignupCompanyDto) {
    const company = await this.db.user.findFirst({
      where: { companyName: dto.companyName, email: dto.email },
    });

    if (company) return exceptions.badRequest(MESSAGE.COMPANY_EXITS);

    const password = await hash(dto.password);

    await this.db.user.create({
      data: {
        email: dto.email,
        role: Role.employer,
        industry: dto.industry,
        password,
        companyName: dto.companyName,
      },
    });

    return accepts(MESSAGE.USER_CREATED);
  }

  async signin(dto: SigninUserWithAdminDto & SigninCompanyDto) {
    let user: User;

    if (dto.companyName) {
      const company = await this.db.user
        .findFirstOrThrow({
          where: { email: dto.email, companyName: dto.companyName, role: Role.employer },
        })
        .catch(() => exceptions.notFound(MESSAGE.USER_NOT_FOUND));

      user = company;
    } else {
      const userOrAdmin = await this.db.user
        .findFirstOrThrow({
          where: {
            email: dto.email,
            NOT: { role: Role.employer },
          },
        })
        .catch(() => exceptions.notFound(MESSAGE.USER_NOT_FOUND));

      user = userOrAdmin;
    }

    if (!user.active) return exceptions.fobbiden(MESSAGE.USER_NOT_ACTIVE);

    const matched = await compareHash(dto.password, user.password);

    if (!matched) return exceptions.badRequest(MESSAGE.PASSWORD_INVALID);

    const payload = { id: user.id, email: user.email, role: user.role };

    const token = await this.jwt.signAsync(payload);

    return accepts(MESSAGE.USER_LOGINED, { data: token });
  }

  async forgotPassword(dto: ForgotPasswordUserWithAdminDto & ForgotPasswordCompanyDto) {
    let user: User;

    if (dto.companyName) {
      const company = await this.db.user
        .findFirstOrThrow({
          where: { role: Role.employer, companyName: dto.companyName, email: dto.email },
        })
        .catch(() => exceptions.notFound(MESSAGE.USER_NOT_FOUND));

      user = company;
    } else {
      const userWithAdmin = await this.db.user
        .findFirstOrThrow({ where: { email: dto.email, NOT: { role: Role.employer } } })
        .catch(() => exceptions.notFound(MESSAGE.USER_NOT_FOUND));

      user = userWithAdmin;
    }

    if (!user.active) return exceptions.fobbiden(MESSAGE.USER_NOT_ACTIVE);

    checkLastUpdated(-10, user.updatedAt);

    const password = await hash(dto.newPassword);

    await this.db.user.update({ where: { id: user.id }, data: { password } });

    return accepts(MESSAGE.USER_FORGET_PASSWORD);
  }
}
