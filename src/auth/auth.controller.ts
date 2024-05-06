import { Body, Controller, HttpCode, HttpStatus, Patch, Post, UsePipes } from '@nestjs/common';
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

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

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
}
