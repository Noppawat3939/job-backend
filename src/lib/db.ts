import { QueryJobs } from 'src/types';
import { eq } from './commons';

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
