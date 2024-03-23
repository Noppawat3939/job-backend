import { z } from 'nestjs-zod/z';
import {
  companyNameSchema,
  emailSchema,
  firstNameSchema,
  industrySchema,
  lastNameSchema,
  newPasswordSchema,
  passwordSchema,
} from './schemas';
import { createZodDto } from 'nestjs-zod';

export const signupUserWithAdminSchema = z.object({
  email: emailSchema.create,
  password: passwordSchema.create,
  firstName: firstNameSchema.create,
  lastName: lastNameSchema.create,
});

export const signupCompanySchema = z.object({
  email: emailSchema.create,
  password: passwordSchema.create,
  companyName: companyNameSchema.create,
  industry: industrySchema.create,
});

export const signinUserWithAdminSchema = z.object({
  email: emailSchema.comon,
  password: passwordSchema.common,
});

export const signinCompanySchema = z.object({
  companyName: companyNameSchema.common,
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

export class SignupUserWithAdminDto extends createZodDto(signupUserWithAdminSchema) {}
export class SignupCompanyDto extends createZodDto(signupCompanySchema) {}
export class SigninUserWithAdminDto extends createZodDto(signinUserWithAdminSchema) {}
export class SigninCompanyDto extends createZodDto(signinCompanySchema) {}
export class ForgotPasswordUserWithAdminDto extends createZodDto(
  forgotPasswordUserWithAdminSchema,
) {}
export class ForgotPasswordCompanyDto extends createZodDto(forgotPasswordCompanySchema) {}
