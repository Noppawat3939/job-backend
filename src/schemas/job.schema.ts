import { z } from 'nestjs-zod/z';
import {
  benefitJobSchema,
  comppanyLocationSchema,
  contractJobSchema,
  descriptionJobSchema,
  positionJobSchema,
  qualificationJobSchema,
  salaryJobSchema,
  transportJobSchema,
  workStyleSchema,
} from './schemas';
import { createZodDto } from 'nestjs-zod';

export const createJobSchema = z.object({
  position: positionJobSchema.create,
  style: workStyleSchema.create,
  location: comppanyLocationSchema.create,
  salary: salaryJobSchema.create,
  jobDescriptions: descriptionJobSchema.create,
  qualifications: qualificationJobSchema.create,
  benefits: benefitJobSchema.create,
  contracts: contractJobSchema.create,
  transports: transportJobSchema.create,
});

export const updateJobSchema = z.object({
  position: positionJobSchema.common,
  style: workStyleSchema.update,
  location: comppanyLocationSchema.common,
  salary: salaryJobSchema.create,
  jobDescriptions: descriptionJobSchema.common,
  qualifications: qualificationJobSchema.common,
  benefits: benefitJobSchema.common,
  contracts: contractJobSchema.common,
  transports: transportJobSchema.common,
});

export class CreateJobDto extends createZodDto(createJobSchema) {}
export class UpdateJobDto extends createZodDto(updateJobSchema) {}
