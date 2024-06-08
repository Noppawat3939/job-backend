import { z } from 'nestjs-zod/z';
import {
  positionJobSchema,
  resumeDetailSchema,
  salaryJobSchema,
  userProfileSchema,
} from './schemas';
import { createZodDto } from 'nestjs-zod';

export const userResumeSchema = z.object({
  position: positionJobSchema.create,
  expectSalary: salaryJobSchema.create,
  profile: userProfileSchema.common,
  details: resumeDetailSchema.common,
});

export class UpdateResumeDto extends createZodDto(userResumeSchema) {}
