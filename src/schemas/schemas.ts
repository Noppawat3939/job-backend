import { z } from 'nestjs-zod/z';

const PASSWORD_MIN_LEN = 8;
const NAME_MIN_LEN = 2;

export const emailSchema = {
  create: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Email is invalid format' }),
  comon: z.string({ required_error: 'Email is required' }),
};

export const passwordSchema = {
  create: z
    .string({ required_error: 'Password is required' })
    .min(PASSWORD_MIN_LEN, { message: `Password must be at least ${PASSWORD_MIN_LEN} charactors` }),
  common: z.string({ required_error: 'Password is required' }),
};

export const newPasswordSchema = {
  create: z
    .string({ required_error: 'New password is required' })
    .min(PASSWORD_MIN_LEN, { message: `Password must be at least ${PASSWORD_MIN_LEN} charactors` }),
};

export const companyNameSchema = {
  create: z
    .string({ required_error: 'Company name is required' })
    .min(NAME_MIN_LEN, { message: `Company name should more than ${NAME_MIN_LEN} charactors` }),
  common: z.string({ required_error: 'Company name is required' }),
};

export const industrySchema = {
  create: z
    .string({ required_error: 'Industry is required' })
    .min(NAME_MIN_LEN, { message: `Industry should more than ${NAME_MIN_LEN} charactors` }),
};

export const firstNameSchema = {
  common: z.string().optional(),
  create: z
    .string({ required_error: 'First name is required' })
    .min(NAME_MIN_LEN, { message: `Fisrt name must be ${NAME_MIN_LEN} charactors` }),
};

export const lastNameSchema = {
  common: z.string().optional(),
  create: z
    .string({ required_error: 'Last name is required' })
    .min(NAME_MIN_LEN, { message: `Last name must be ${NAME_MIN_LEN} charactors` }),
};
