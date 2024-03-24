import { z } from 'nestjs-zod/z';
import {
  companyNameSchema,
  emailSchema,
  firstNameSchema,
  industrySchema,
  lastNameSchema,
  passwordSchema,
} from './schemas';
import { createZodDto } from 'nestjs-zod';

export const updateEmailSchema = z.object({
  email: emailSchema.create,
  password: passwordSchema.common,
});

export const updateCompanyInfoSchema = z.object({
  companyName: companyNameSchema.update,
  industry: industrySchema.update,
});

export const updateUserInfoSchema = z.object({
  firstName: firstNameSchema.common,
  lastName: lastNameSchema.common,
});

export class UpdateEmailDto extends createZodDto(updateEmailSchema) {}
export class UpdateCompanyInfoDto extends createZodDto(updateCompanyInfoSchema) {}
export class UpdateUserInfoDto extends createZodDto(updateUserInfoSchema) {}
