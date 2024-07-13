import { z } from 'nestjs-zod/z';
import { refNumberSchema } from './schemas';
import { createZodDto } from 'nestjs-zod';

export const createPaymentSchema = z.object({
  refNumber: refNumberSchema.create,
});

export class CreatePaymentDto extends createZodDto(createPaymentSchema) {}
