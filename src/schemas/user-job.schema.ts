import { z } from 'nestjs-zod/z';
import { positionJobSchema, templateResumeSchema } from './schemas';
import { createZodDto } from 'nestjs-zod';

export const userResumeSchema = z.object({
  position: positionJobSchema.create,
  ...templateResumeSchema,
});

export class UpdateResumeDto extends createZodDto(userResumeSchema) {}
