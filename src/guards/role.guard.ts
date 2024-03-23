import type { Role, User } from '@prisma/client';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { exceptions } from 'src/lib';
import { MESSAGE } from 'src/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>('role', context.getHandler());

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    const allowed = requiredRoles.includes(user.role);

    if (!allowed) return exceptions.fobbiden(MESSAGE.NOT_PERMISSION);

    return allowed;
  }
}
