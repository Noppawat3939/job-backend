import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MESSAGE } from 'src/constants';
import { eq, exceptions, orHas } from 'src/lib';

@Injectable()
export class PublicKeyGuard implements CanActivate {
  constructor(private config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['api-key'];
    const userAgent = request.headers['user-agent'];
    const allowedUserAgent = [
      this.config.get('USER_AGENT_POSTMAN'),
      this.config.get('USER_AGENT_THUNDER_CLIENT'),
    ].includes(userAgent);

    const isAllowed = orHas([allowedUserAgent, eq(apiKey, this.config.get('PUBLIC_API_KEY'))]);

    if (isAllowed) return true;

    return exceptions.notAllowed(MESSAGE.PUBLIC_KEY_NOT_FOUND);
  }
}
