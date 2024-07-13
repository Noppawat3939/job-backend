import { z } from 'nestjs-zod/z';
import { refNumberSchema, paymentSlipUrlSchema } from './schemas';
import { createZodDto } from 'nestjs-zod';

export const createPaymentSchema = z.object({
  refNumber: refNumberSchema.create,
  slipImage: paymentSlipUrlSchema.create,
});

export class CreatePaymentDto extends createZodDto(createPaymentSchema) {}
