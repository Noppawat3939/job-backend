import { JwtModuleOptions } from '@nestjs/jwt';
import { IAuthModuleOptions } from '@nestjs/passport';

export const jwtOptions = {
  global: true,
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '3h' },
} satisfies JwtModuleOptions;

export const passportOptions = { defaultStrategy: 'jwt' } satisfies IAuthModuleOptions<any>;
