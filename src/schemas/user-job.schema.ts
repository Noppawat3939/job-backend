import { z } from 'nestjs-zod/z';
import { templateResumeSchema } from './schemas';
import { createZodDto } from 'nestjs-zod';

export const userResumeSchema = z.object(templateResumeSchema);

export class UpdateResumeDto extends createZodDto(userResumeSchema) {}
