import type { HttpModuleOptions } from '@nestjs/axios';
import type { JwtModuleOptions } from '@nestjs/jwt';
import type { IAuthModuleOptions } from '@nestjs/passport';

export const jwtOptions = {
  global: true,
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '6h' },
} satisfies JwtModuleOptions;

export const passportOptions = { defaultStrategy: 'jwt' } satisfies IAuthModuleOptions<any>;

export const httpGetOptions = { timeout: 10000, method: 'GET' } satisfies HttpModuleOptions;
