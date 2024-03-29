import { z } from 'nestjs-zod/z';
import {
  benefitJobSchema,
  companyNameSchema,
  comppanyLocationSchema,
  comppanyPropfileSchema,
  contractJobSchema,
  descriptionJobSchema,
  industrySchema,
  positionJobSchema,
  qualificationJobSchema,
  salaryJobSchema,
  transportJobSchema,
  workStyleSchema,
} from './schemas';

export const createJobSchema = z.object({
  position: positionJobSchema.create,
  style: workStyleSchema.create,
  company: companyNameSchema.create,
  industry: industrySchema.create,
  companyProfile: comppanyPropfileSchema.create,
  location: comppanyLocationSchema.create,
  salary: salaryJobSchema.create,
  jobDescriptions: descriptionJobSchema.create,
  qualifications: qualificationJobSchema.create,
  benefits: benefitJobSchema.create,
  contracts: contractJobSchema.create,
  transports: transportJobSchema.create,
});
