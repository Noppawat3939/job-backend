import { QueryJobs } from 'src/types';
import { eq } from './commons';

export const generateQueryJob = (query: QueryJobs) => {
  const filter = {
    ...(query.company && { company: query.company }),
    ...(query.style && { style: query.style }),
    ...(query.position && { position: query.position }),
    ...(query.industry && { industry: query.industry }),
    ...(query.location && { location: query.location }),
    ...(query.fulltime && { fulltime: eq(String(query.fulltime), 'true') }),
    ...(query.urgent && { urgent: eq(String(query.urgent), 'true') }),
    ...(query.active && {
      active: eq(String(query.active), 'null') ? null : eq(String(query.active), 'true'),
    }),
  };

  return filter;
};
