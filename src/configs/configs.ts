import { MailerOptions } from '@nestjs-modules/mailer';
import type { HttpModuleOptions } from '@nestjs/axios';
import { type ConfigModuleOptions } from '@nestjs/config';
import type { JwtModuleOptions } from '@nestjs/jwt';
import type { IAuthModuleOptions } from '@nestjs/passport';

const {
  MAILER_HOST: mailerHost,
  MAILER_PORT: mailerPort,
  MAILER_USER: mailerUser,
  MAILER_PASS: mailerPass,
} = process.env;

export const configOptins = { isGlobal: true } satisfies ConfigModuleOptions;

export const jwtOptions = {
  global: true,
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '6h' },
} satisfies JwtModuleOptions;

export const passportOptions = { defaultStrategy: 'jwt' } satisfies IAuthModuleOptions<unknown>;

export const httpGetOptions = { timeout: 10000, method: 'GET' } satisfies HttpModuleOptions;

export const mailerOptions = {
  transport: {
    host: mailerHost,
    port: +mailerPort,
    secure: false,
    auth: { user: mailerUser, pass: mailerPass },
  },
} satisfies MailerOptions;
