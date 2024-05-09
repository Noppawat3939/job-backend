import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { type Profile } from 'passport';
import { Strategy } from 'passport-google-oauth20';
import { type VerifiedCallback } from 'passport-jwt';
import { Provider, type GoogleUser } from 'src/types';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(env: ConfigService) {
    super({
      clientID: env.get('GOOGLE_CLIENT_ID'),
      clientSecret: env.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: env.get('GOOGLE_CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifiedCallback,
  ) {
    const { name, emails, photos, id } = profile;
    const user = {
      providerId: id,
      provider: Provider.Google,
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      picture: photos[0].value,
      accessToken,
    } satisfies GoogleUser;

    done(null, user);
  }
}
