import { Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('signup/admin')
  signupAdmin() {
    return { msg: 'OK signup' };
  }
}
