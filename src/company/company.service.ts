import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { MESSAGE } from 'src/constants';
import { DbService } from 'src/db';
import { accepts, eq, generateQueryJob } from 'src/lib';
import { QueryJobs } from 'src/types';

const MIN_VALUE = 0;
const SALARY_RANGE = 2;

@Injectable()
export class CompanyService {
  constructor(private readonly db: DbService) {}

  async getJobsByCompany(company: User['companyName'], query?: Omit<QueryJobs, 'company'>) {
    const salary_min = +query?.salary_min || MIN_VALUE;
    const salary_max = +query?.salary_max || MIN_VALUE;

    const filter = generateQueryJob(query);

    const where = { company, ...filter };

    const data = await this.db.job.findMany({ where, orderBy: { createdAt: 'desc' } });

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
}
