export const VALIDATION_MESSAGE = {
  EMAIL: {
    REQUIRED: 'Email is required',
    INVALID: 'Email is invalid format',
  },
  PASSWORD: {
    REQUIRED: 'Password is required',
    MIN: 'Password must be at least {min} charactors',
  },
  NEW_PASSWORD: {
    REQUIRED: 'New password is required',
    MIN: 'New password must be at least {min} charactors',
  },
  COMPANY_NAME: {
    REQUIRED: 'Company name is required',
    MIN: 'Company name should more than {min} charactors',
  },
  INDUSTRY: {
    REQUIRED: 'Industry is required',
    MIN: 'Industry should more than {min} charactors',
  },
  FIRST_NAME: {
    REQUIRED: 'First name is required',
    MIN: 'Fisrt name must be {min} charactors',
  },
  LAST_NAME: {
    REQUIRED: 'Last name is required',
    MIN: 'Last name must be {min} charactors',
  },
  POSITION_JOB: {
    REQUIRED: 'Position job is required',
    MIN: 'Position job must be {min} charactors',
  },
  WORK_STYLE: {
    INVALID: 'Woking style is invalid',
  },
  JOB_TYPE: {
    INVALID: 'Job type is invalid',
  },
  EXP_LEVEL: {
    INVALID: 'Experience level is invalid',
  },
  COMPANY_PROFILE: {
    REQUIRED: 'Company profile is required',
    MIN: 'Company profile must be {min} charactors',
  },
  COMPANY_LOCATION: {
    REQUIRED: 'Company location is required',
    MIN: 'Company location must be {min} charactors',
  },
  CATEGORY_JOB: {
    REQUIRED: 'Category job is required',
    MIN: 'Category job mus be {min} charactors',
  },
} as const;
