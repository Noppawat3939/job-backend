import { z } from 'nestjs-zod/z';
import {
  autoApproveSchema,
  companyNameSchema,
  emailSchema,
  firstNameSchema,
  industrySchema,
  lastNameSchema,
  newPasswordSchema,
  oobCodeSchema,
  passwordSchema,
  verifyCodeSchema,
} from './schemas';
import { createZodDto } from 'nestjs-zod';

export const signupUserWithAdminSchema = z.object({
  email: emailSchema.create,
  password: passwordSchema.create,
  firstName: firstNameSchema.create,
  lastName: lastNameSchema.create,
  autoApprove: autoApproveSchema.create,
  verifyCode: verifyCodeSchema.create,
  oobCode: oobCodeSchema.create,
});

export const signupCompanySchema = z.object({
  email: emailSchema.create,
  password: passwordSchema.create,
  companyName: companyNameSchema.create,
  industry: industrySchema.create,
});

export const signinSchema = z.object({
  email: emailSchema.comon,
  password: passwordSchema.common,
});

export const forgotPasswordUserWithAdminSchema = z.object({
  email: emailSchema.comon,
  newPassword: newPasswordSchema.create,
});

export const forgotPasswordCompanySchema = z.object({
  companyName: companyNameSchema.common,
  email: companyNameSchema.common,
  newPassword: newPasswordSchema.create,
});

export const sendVerifyCodeSchema = z.object({
  email: emailSchema.comon,
});

export class SignupUserWithAdminDto extends createZodDto(signupUserWithAdminSchema) {}
export class SignupCompanyDto extends createZodDto(signupCompanySchema) {}
export class ForgotPasswordUserWithAdminDto extends createZodDto(
  forgotPasswordUserWithAdminSchema,
) {}
export class ForgotPasswordCompanyDto extends createZodDto(forgotPasswordCompanySchema) {}
export class SigninDto extends createZodDto(signinSchema) {}
export class SendEmailVerifyDto extends createZodDto(sendVerifyCodeSchema) {}
