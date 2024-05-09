import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import {
  ForgotPasswordCompanyDto,
  ForgotPasswordUserWithAdminDto,
  SigninDto,
  SignupCompanyDto,
  SignupUserWithAdminDto,
  forgotPasswordCompanySchema,
  forgotPasswordUserWithAdminSchema,
  signinSchema,
  signupCompanySchema,
  signupUserWithAdminSchema,
} from 'src/schemas';
import { AuthService } from './auth.service';
import { Role } from '@prisma/client';
import { GoogleOauthGuard, SocialKeyAuthGuard } from 'src/guards';
import { Request, Response } from 'express';
import type { GoogleUser, JwtDecode } from 'src/types';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signup/admin')
  @UsePipes(new ZodValidationPipe(signupUserWithAdminSchema))
  signupAdmin(@Body() body: SignupUserWithAdminDto) {
    return this.service.signupUserWithAdmin(body, Role.admin);
  }

  @Post('signup/user')
  @UsePipes(new ZodValidationPipe(signupUserWithAdminSchema))
  signupUser(@Body() body: SignupUserWithAdminDto) {
    return this.service.signupUserWithAdmin(body, Role.user);
  }

  @Post('signup/company')
  @UsePipes(new ZodValidationPipe(signupCompanySchema))
  signupCompany(@Body() body: SignupCompanyDto) {
    return this.service.signupCompany(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @UsePipes(new ZodValidationPipe(signinSchema))
  signin(@Body() body: SigninDto) {
    return this.service.signin(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin/company')
  @UsePipes(new ZodValidationPipe(signinSchema))
  signinCompany(@Body() body: SigninDto) {
    const withCompany = true;

    return this.service.signin(body, withCompany);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('forgotpassword')
  @UsePipes(new ZodValidationPipe(forgotPasswordUserWithAdminSchema))
  forgotPasswordUserWithAdmin(@Body() body: ForgotPasswordUserWithAdminDto) {
    return this.service.forgotPassword(body);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('forgotpassword/company')
  @UsePipes(new ZodValidationPipe(forgotPasswordCompanySchema))
  forgotPasswordCompany(@Body() body: ForgotPasswordCompanyDto) {
    return this.service.forgotPassword(body);
  }

  @Get('signin/social/url')
  @UseGuards(SocialKeyAuthGuard)
  getSigninSocialUrl(@Req() req: Request) {
    const callbackUrl = req.headers['callback-url'] as string;

    return this.service.getSocialSigninUrl(req['provider'], callbackUrl);
  }

  @Get('google/redirect')
  @UseGuards(GoogleOauthGuard)
  async googleRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user as GoogleUser;

    const { token, url } = await this.service.oAuthLogin(user);
    const { exp } = this.jwtService.decode(token) as JwtDecode;

    const expires = new Date(Number(exp) * 1000);
    res.cookie('token', token, { expires });

    return res.redirect(url || 'http://localhost:3000');
  }
}
