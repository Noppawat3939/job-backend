import { WorkStyle } from '@prisma/client';
import { z } from 'nestjs-zod/z';

const PASSWORD_MIN_LEN = 8;
const NAME_MIN_LEN = 2;
const SALARY_RANGE_BAHT = { START_MIN: 0, START_MAX: 1 };

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
  create: z.enum(
    [WorkStyle.hybrid, WorkStyle.on_site, WorkStyle.remote, WorkStyle.work_from_home],
    {
      errorMap: () => ({ message: 'Woking style is invalid' }),
    },
  ),
  update: z
    .enum([WorkStyle.hybrid, WorkStyle.on_site, WorkStyle.remote, WorkStyle.work_from_home], {
      errorMap: () => ({ message: 'Woking style is invalid' }),
    })
    .optional(),
};

export const comppanyPropfileSchema = {
  common: z.string().optional(),
  update: z
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
  create: z
    .tuple([
      z
        .number()
        .min(SALARY_RANGE_BAHT.START_MIN, {
          message: `Salary should be mininum min range ${SALARY_RANGE_BAHT.START_MIN} baht`,
        })
        .optional(),
      z
        .number()
        .min(SALARY_RANGE_BAHT.START_MAX, {
          message: `Salary should be minimum max range ${SALARY_RANGE_BAHT.START_MAX} baht`,
        })
        .optional(),
    ])
    .refine((values) => values[1] > values[0], {
      message: 'Salary max value range should more than or requal min value range',
    })
    .or(z.tuple([z.number().default(SALARY_RANGE_BAHT.START_MIN)]))
    .or(z.number().default(SALARY_RANGE_BAHT.START_MIN)),
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

export const fulltimeJobSchema = {
  common: z.boolean().optional(),
};
