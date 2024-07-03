import { MailerService } from '@nestjs-modules/mailer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma, Role, User } from '@prisma/client';
import { Cache } from 'cache-manager';
import dayjs from 'dayjs';
import { MESSAGE } from 'src/constants';
import { DbService } from 'src/db';
import {
  accepts,
  checkLastUpdated,
  compareHash,
  eq,
  exceptions,
  generateCode,
  generateMailerOptions,
  hash,
} from 'src/lib';
import {
  ForgotPasswordCompanyDto,
  ForgotPasswordUserWithAdminDto,
  SendEmailVerifyDto,
  SigninDto,
  SignupCompanyDto,
  SignupUserWithAdminDto,
} from 'src/schemas';
import type { GoogleUser, JwtPayload, OobDecode } from 'src/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DbService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly mailer: MailerService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async signupUserOrAdmin(dto: SignupUserWithAdminDto, role: Role) {
    const user = await this.db.user.findFirst({
      where: { email: dto.email, role },
    });

    if (user) return exceptions.badRequest(MESSAGE.EMAIL_EXITS);

    if (eq(role, Role.user)) {
      if (!dto.verifyCode || !dto.oobCode) return exceptions.badRequest(MESSAGE.INVALID);

      const oobDecoded = this.jwt.decode(dto.oobCode) satisfies OobDecode;

      if (dayjs().isAfter(oobDecoded.expiresIn))
        return exceptions.badRequest('Oob code is expired');
      if (dto.verifyCode !== oobDecoded.code || oobDecoded.email !== dto.email)
        return exceptions.badRequest(MESSAGE.INVALID);
    }

    const password = await hash(dto.password);

    const createParams = {
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      password,
      role,
      active: eq(role, Role.user) || dto.autoApprove ? true : null,
    } as Prisma.UserCreateInput;

    await this.db.user.create({
      data: createParams,
    });

    const mailerOption = generateMailerOptions({
      email: createParams.email,
      full_name: `${createParams.firstName} ${createParams.lastName}`,
    });

    this.mailer.sendMail(mailerOption.createAccount);

    return accepts(MESSAGE.CREATE_SUCCESS);
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

    return accepts(MESSAGE.CREATE_SUCCESS);
  }

  async signin(dto: SigninDto, isCompany?: boolean) {
    let user: User;

    if (isCompany) {
      const company = await this.db.user
        .findFirstOrThrow({
          where: { email: dto.email, role: Role.employer },
        })
        .catch(() => exceptions.notFound(MESSAGE.NOT_FOUND));

      user = company;
    } else {
      const notCompanyUser = await this.db.user
        .findFirstOrThrow({
          where: {
            email: dto.email,
            NOT: { role: Role.employer },
          },
        })
        .catch(() => exceptions.notFound(MESSAGE.NOT_FOUND));

      user = notCompanyUser;
    }

    if (!user.active) return exceptions.fobbiden(MESSAGE.NOT_ACCEPT);

    const matched = await compareHash(dto.password, user.password);

    if (!matched) return exceptions.badRequest(MESSAGE.INVALID);

    const payload = { id: user.id, email: user.email, role: user.role };

    const token = await this.jwt.signAsync(payload);

    return accepts(null, { data: token });
  }

  async forgotPassword(dto: ForgotPasswordUserWithAdminDto & ForgotPasswordCompanyDto) {
    let user: User;

    if (dto.companyName) {
      const company = await this.db.user
        .findFirstOrThrow({
          where: { role: Role.employer, companyName: dto.companyName, email: dto.email },
        })
        .catch(() => exceptions.notFound(MESSAGE.NOT_FOUND));

      user = company;
    } else {
      const userWithAdmin = await this.db.user
        .findFirstOrThrow({ where: { email: dto.email, NOT: { role: Role.employer } } })
        .catch(() => exceptions.notFound(MESSAGE.NOT_FOUND));

      user = userWithAdmin;
    }

    if (!user.active) return exceptions.fobbiden(MESSAGE.USER_NOT_ACTIVE);

    checkLastUpdated(-10, user.updatedAt);

    const password = await hash(dto.newPassword);

    await this.db.user.update({ where: { id: user.id }, data: { password } });

    return accepts(MESSAGE.UPDATE_SUCCESS);
  }

  async getSocialSigninUrl(provider: string, callbackUrl: string) {
    await this.cache.set(provider, callbackUrl);

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

      const payload = { id: 0, email: '', role: null } as JwtPayload;

      if (!foundUser) {
        const password = await hash(user.providerId);
        const [firstName, lastName] = user.name.split(' ');

        const createParams = {
          email: user.email,
          firstName,
          lastName,
          provider: user.provider,
          password,
          active: true,
          role: Role.user,
          userProfile: user.picture,
        } as Prisma.UserCreateInput;

        const created = await this.db.user.create({
          data: createParams,
        });

        payload.id = created.id;
        payload.email = created.email;
        payload.role = created.role;
      } else {
        payload.id = foundUser.id;
        payload.email = foundUser.email;
        payload.role = foundUser.role;
      }

      const token = await this.jwt.signAsync(payload);
      const cachedUrl = await this.cache.get<string>(user.provider);

      return { token, url: cachedUrl };
    } catch (error) {
      return exceptions.internalServerError(`Can't signin with ${user.provider}`);
    }
  }

  async sendVerifyEmail(dto: SendEmailVerifyDto) {
    const code = generateCode();
    const payload = { code, expiresIn: dayjs().add(10, 'minute').toDate(), email: dto.email };
    const verify_code = await this.jwt.signAsync(payload);

    const mailerOption = generateMailerOptions({ email: dto.email, verify_code: code });

    this.mailer.sendMail(mailerOption.emailVerify);

    return accepts('Send email', { data: { oob_code: verify_code } });
  }
}
