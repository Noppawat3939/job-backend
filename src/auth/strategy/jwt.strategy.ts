import type { JwtPayload } from 'src/types';
import { Role } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { DbService } from 'src/db';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { eq, exceptions } from 'src/lib';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private db: DbService,
    config: ConfigService,
  ) {
    const secretOrKey = config.get('JWT_SECRET');

    super({
      secretOrKey,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    const isEmployer = eq(payload.role, Role.employer);

    const user = await this.db.user.findFirst({
      where: { id: payload.id, email: payload.email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        companyName: isEmployer,
        industry: isEmployer,
      },
    });

    if (!user) return exceptions.unAuthorized();

    return user;
  }
}
