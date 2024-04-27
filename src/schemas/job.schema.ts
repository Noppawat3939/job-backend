import { z } from 'nestjs-zod/z';
import {
  benefitJobSchema,
  categoryJobSchema,
  comppanyLocationSchema,
  contractJobSchema,
  descriptionJobSchema,
  experienceLevelSchema,
  jobTypeSchema,
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
  jobType: jobTypeSchema.create,
  experienceLevel: experienceLevelSchema.create,
  category: categoryJobSchema.create,
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
  jobType: jobTypeSchema.update,
  experienceLevel: experienceLevelSchema.update,
  category: categoryJobSchema.common,
});

export class CreateJobDto extends createZodDto(createJobSchema) {}
export class UpdateJobDto extends createZodDto(updateJobSchema) {}
