import { ExperienceLevel, JobType, WorkStyle } from '@prisma/client';
import { z } from 'nestjs-zod/z';
import { VALIDATION_MESSAGE as _M } from 'src/constants';

const PASSWORD_MIN_LEN = 8;
const NAME_MIN_LEN = 2;
const SALARY_RANGE_BAHT = { START_MIN: 0, START_MAX: 1 };

export const emailSchema = {
  create: z.string({ required_error: _M.EMAIL.REQUIRED }).email({ message: _M.EMAIL.INVALID }),
  comon: z.string({ required_error: _M.EMAIL.REQUIRED }),
};

export const passwordSchema = {
  create: z
    .string({ required_error: _M.PASSWORD.REQUIRED })
    .min(PASSWORD_MIN_LEN, { message: _M.PASSWORD.MIN.replace('{min}', String(PASSWORD_MIN_LEN)) }),
  common: z.string({ required_error: _M.PASSWORD.REQUIRED }),
};

export const newPasswordSchema = {
  create: z.string({ required_error: _M.NEW_PASSWORD.REQUIRED }).min(PASSWORD_MIN_LEN, {
    message: _M.NEW_PASSWORD.MIN.replace('{min}', String(PASSWORD_MIN_LEN)),
  }),
};

export const companyNameSchema = {
  create: z
    .string({ required_error: _M.COMPANY_NAME.REQUIRED })
    .min(NAME_MIN_LEN, { message: _M.COMPANY_NAME.MIN.replace('{min}', String(NAME_MIN_LEN)) }),
  common: z.string({ required_error: _M.COMPANY_NAME.REQUIRED }),
  update: z.string().optional(),
};

export const industrySchema = {
  create: z
    .string({ required_error: _M.INDUSTRY.REQUIRED })
    .min(NAME_MIN_LEN, { message: _M.INDUSTRY.MIN.replace('{min}', String(NAME_MIN_LEN)) }),
  update: z.string().optional(),
};

export const firstNameSchema = {
  common: z.string().optional(),
  create: z
    .string({ required_error: _M.FIRST_NAME.REQUIRED })
    .min(NAME_MIN_LEN, { message: _M.FIRST_NAME.MIN.replace('{min}', String(NAME_MIN_LEN)) }),
};

export const lastNameSchema = {
  common: z.string().optional(),
  create: z
    .string({ required_error: _M.LAST_NAME.REQUIRED })
    .min(NAME_MIN_LEN, { message: _M.LAST_NAME.MIN.replace('{min}', String(NAME_MIN_LEN)) }),
};

export const autoApproveSchema = {
  create: z.boolean().optional(),
};

export const positionJobSchema = {
  common: z.string().optional(),
  create: z
    .string({ required_error: _M.POSITION_JOB.REQUIRED })
    .min(NAME_MIN_LEN, { message: _M.POSITION_JOB.MIN.replace('{min}', String(NAME_MIN_LEN)) }),
};

export const workStyleSchema = {
  create: z.enum(
    [WorkStyle.hybrid, WorkStyle.on_site, WorkStyle.remote, WorkStyle.work_from_home],
    {
      errorMap: () => ({ message: _M.WORK_STYLE.INVALID }),
    },
  ),
  update: z
    .enum([WorkStyle.hybrid, WorkStyle.on_site, WorkStyle.remote, WorkStyle.work_from_home], {
      errorMap: () => ({ message: _M.WORK_STYLE.INVALID }),
    })
    .optional(),
};

export const comppanyPropfileSchema = {
  common: z.string().optional(),
  update: z
    .string({ required_error: _M.COMPANY_PROFILE.REQUIRED })
    .min(NAME_MIN_LEN, { message: _M.COMPANY_PROFILE.MIN.replace('{min}', String(NAME_MIN_LEN)) }),
};

export const comppanyLocationSchema = {
  common: z.string().optional(),
  create: z
    .string({ required_error: _M.COMPANY_LOCATION.REQUIRED })
    .min(NAME_MIN_LEN, { message: _M.COMPANY_LOCATION.MIN.replace('{min}', String(NAME_MIN_LEN)) }),
};

export const categoryJobSchema = {
  common: z.string().optional(),
  create: z
    .string({ required_error: _M.CATEGORY_JOB.REQUIRED })
    .min(NAME_MIN_LEN, { message: _M.CATEGORY_JOB.MIN.replace('{min}', String(NAME_MIN_LEN)) }),
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

export const jobTypeSchema = {
  create: z.enum([JobType.internship, JobType.contract, JobType.full_time, JobType.past_time], {
    errorMap: () => ({ message: _M.JOB_TYPE.INVALID }),
  }),
  update: z
    .enum([JobType.internship, JobType.contract, JobType.full_time, JobType.past_time], {
      errorMap: () => ({ message: _M.JOB_TYPE.INVALID }),
    })
    .optional(),
};

export const experienceLevelSchema = {
  create: z.enum(
    [
      ExperienceLevel.entry,
      ExperienceLevel.middle,
      ExperienceLevel.no_required,
      ExperienceLevel.senior,
    ],
    {
      errorMap: () => ({ message: _M.EXP_LEVEL.INVALID }),
    },
  ),
  update: z
    .enum(
      [
        ExperienceLevel.entry,
        ExperienceLevel.middle,
        ExperienceLevel.no_required,
        ExperienceLevel.senior,
      ],
      {
        errorMap: () => ({ message: _M.EXP_LEVEL.INVALID }),
      },
    )
    .optional(),
};

export const userProfileSchema = {
  common: z.string().optional(),
};

export const resumeDetailSchema = {
  common: z.json().optional(),
};
