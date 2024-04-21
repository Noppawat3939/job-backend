import { Injectable } from '@nestjs/common';
import { Job, User } from '@prisma/client';
import { MESSAGE } from 'src/constants';
import { DbService } from 'src/db';
import { accepts, eq, exceptions } from 'src/lib';
import { QueryJobs } from 'src/types';

const MIN_VALUE = 0;
const SALARY_RANGE = 2;

@Injectable()
export class CompanyService {
  constructor(private readonly db: DbService) {}

  async getJobsByCompany(company: User['companyName'], query?: Omit<QueryJobs, 'company'>) {
    const salary_min = +query?.salary_min || MIN_VALUE;
    const salary_max = +query?.salary_max || MIN_VALUE;

    const filter = {
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

    const data = await this.db.job.findMany({
      where: { company, ...filter },
      orderBy: { createdAt: 'desc' },
    });

    if (eq(data.length, MIN_VALUE)) return accepts(MESSAGE.JOB_NOT_FOUND);

    const filteredSalary = data.filter(({ salary }) => {
      const [min, max] = salary;
      const hasMinMax = eq(salary.length, SALARY_RANGE);

      if (hasMinMax && !eq(salary_max, MIN_VALUE)) return min >= salary_min && max <= salary_max;
      if (hasMinMax && eq(salary_max, MIN_VALUE)) return min >= salary_min;

      return min;
    });

    return accepts(MESSAGE.GETTED_JOBS, { data: filteredSalary, total: filteredSalary.length });
  }

  async openJobByTimes(company: User['companyName'], jobId: number) {
    await this.db.job
      .findFirstOrThrow({ where: { company, id: jobId } })
      .catch(() => exceptions.badRequest(MESSAGE.JOB_NOT_FOUND));

    return {};
  }
}
