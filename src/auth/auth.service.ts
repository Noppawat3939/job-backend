import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { MESSAGE } from 'src/constants';
import { DbService } from 'src/db';
import { accepts, checkLastUpdated, compareHash, eq, exceptions, hash } from 'src/lib';
import {
  ForgotPasswordCompanyDto,
  ForgotPasswordUserWithAdminDto,
  SigninDto,
  SignupCompanyDto,
  SignupUserWithAdminDto,
} from 'src/schemas';
import { GoogleUser } from 'src/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DbService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
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
        active: eq(role, 'user') ? true : null,
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

  async signin(dto: SigninDto, isCompany?: boolean) {
    let user: User;

    if (isCompany) {
      const company = await this.db.user
        .findFirstOrThrow({
          where: { email: dto.email, role: Role.employer },
        })
        .catch(() => exceptions.notFound(MESSAGE.USER_NOT_FOUND));

      user = company;
    } else {
      const notCompanyUser = await this.db.user
        .findFirstOrThrow({
          where: {
            email: dto.email,
            NOT: { role: Role.employer },
          },
        })
        .catch(() => exceptions.notFound(MESSAGE.USER_NOT_FOUND));

      user = notCompanyUser;
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

  async getSocialSigninUrl(provider: string) {
    const googleCbUrl = encodeURIComponent(this.config.get('GOOGLE_CALLBACK_URL'));

    const mappingProviderUrl = {
      google: `${this.config.get('GOOGLE_OAUTH_URL')}?response_type=code&redirect_uri=${googleCbUrl}&scope=profile%20email&client_id=${this.config.get('GOOGLE_CLIENT_ID')}&service=lso&o2v=2&ddm=0&flowName=GeneralOAuthFlow`,
    };

    const url = mappingProviderUrl[provider];

    return accepts(null, { data: url });
  }

  async oAuthLogin(user: GoogleUser) {
    try {
      const foundUser = await this.db.user.findFirst({
        where: { email: user.email, role: Role.user },
      });

      const payload = { id: 0, email: '', role: null } as {
        id: number;
        email: string;
        role: Role | null;
      };

      if (!foundUser) {
        const password = await hash(user.providerId);
        const [firstName, lastName] = user.name.split(' ');

        const created = await this.db.user.create({
          data: {
            email: user.email,
            firstName,
            lastName,
            provider: user.provider,
            password,
            active: true,
            role: Role.user,
          },
        });

        payload.id = created.id;
        payload.email = created.email;
        payload.role = created.role;

        const token = await this.jwt.signAsync(payload);

        return { token };
      }

      payload.id = foundUser.id;
      payload.email = foundUser.email;
      payload.role = foundUser.role;

      const token = await this.jwt.signAsync(payload);

      return { token };
    } catch (error) {
      console.log(error);
      return exceptions.internalServerError();
    }
  }
}
