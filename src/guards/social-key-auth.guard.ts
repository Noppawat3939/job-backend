import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MESSAGE } from 'src/constants';
import { exceptions } from 'src/lib';

@Injectable()
export class SocialKeyAuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const apiKey = req.headers['api-key'];

    let allowed: boolean;
    let provider: string;

    const socialKey = {
      google: this.config.get('GOOGLE_API_KEY'),
    };

    for (const k in socialKey) {
      if (socialKey[k] === apiKey) {
        allowed = true;
        provider = k;
      } else {
        allowed = false;
      }
    }

    if (allowed) {
      req['provider'] = provider;
      return allowed;
    }

    return exceptions.fobbiden(MESSAGE.PUBLIC_KEY_NOT_FOUND);
  }
}
