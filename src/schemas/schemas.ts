import { WorkStyle } from '@prisma/client';
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
  update: z.string().optional(),
};

export const industrySchema = {
  create: z
    .string({ required_error: 'Industry is required' })
    .min(NAME_MIN_LEN, { message: `Industry should more than ${NAME_MIN_LEN} charactors` }),
  update: z.string().optional(),
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

export const positionJobSchema = {
  common: z.string().optional(),
  create: z
    .string({ required_error: 'Position job is required' })
    .min(NAME_MIN_LEN, { message: `Position job must be ${NAME_MIN_LEN} charactors` }),
};

export const workStyleSchema = {
  common: z.string().optional(),
  create: z.enum(
    [WorkStyle.hybrid, WorkStyle.on_site, WorkStyle.remote, WorkStyle.work_from_home],
    {
      required_error: 'Work style is required',
      errorMap: () => ({ message: 'Woking style is invalid' }),
    },
  ),
};

export const comppanyPropfileSchema = {
  common: z.string().optional(),
  create: z
    .string({ required_error: 'Company profile is required' })
    .min(NAME_MIN_LEN, { message: `Company profile must be ${NAME_MIN_LEN} charactors` }),
};

export const comppanyLocationSchema = {
  common: z.string().optional(),
  create: z
    .string({ required_error: 'Company location is required' })
    .min(NAME_MIN_LEN, { message: `Company location must be ${NAME_MIN_LEN} charactors` }),
};

export const salaryJobSchema = {
  common: z.string().optional(),
  create: z.string({ required_error: 'Salary job is required' }),
};

export const descriptionJobSchema = {
  common: z.string().array().optional(),
  create: z.string().array().optional(),
};

export const qualificationJobSchema = {
  common: z.string().array().optional(),
  create: z.string().array().optional(),
};

export const benefitJobSchema = {
  common: z.string().array().optional(),
  create: z.string().array().optional(),
};
export const contractJobSchema = {
  common: z.string().array().optional(),
  create: z.string().array().optional(),
};
export const transportJobSchema = {
  common: z.string().array().optional(),
  create: z.string().array().optional(),
};
