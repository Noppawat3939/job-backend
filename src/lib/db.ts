import { QueryJobs, Transform } from 'src/types';
import { eq } from './commons';
import { UpdateJobDto } from 'src/schemas';

export const generateQueryJobs = (query: QueryJobs) => {
  const filter = {
    ...(query.company && { company: query.company }),
    ...(query.style && { style: query.style }),
    ...(query.jobType && { jobType: query.jobType }),
    ...(query.experienceLevel && { experienceLevel: query.experienceLevel }),
    ...(query.position && { position: query.position }),
    ...(query.industry && { industry: query.industry }),
    ...(query.location && { location: query.location }),
    ...(query.category && { category: query.category }),
    ...(query.urgent && { urgent: eq(String(query.urgent), 'true') }),
    ...(query.active && {
      active: eq(String(query.active), 'null') ? null : eq(String(query.active), 'true'),
    }),
  };

  return filter;
};

export const generateUpdateJob = (data: Transform<UpdateJobDto, { salary: number[] }>) => {
  const updated = {
    ...(data.position && { position: data.position }),
    ...(data.style && { style: data.style }),
    ...(data.location && { location: data.location }),
    ...(data.salary && { salary: data.salary }),
    ...(data.jobDescriptions && { jobDescriptions: data.jobDescriptions }),
    ...(data.qualifications && { qualifications: data.qualifications }),
    ...(data.benefits && { benefits: data.benefits }),
    ...(data.contracts && { contracts: data.contracts }),
    ...(data.transports && { transports: data.transports }),
    ...(data.jobType && { jobType: data.jobType }),
    ...(data.experienceLevel && { experienceLevel: data.experienceLevel }),
    ...(data.category && { category: data.category }),
  };

  return updated;
};
