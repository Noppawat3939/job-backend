import { Injectable } from '@nestjs/common';
import { ApplicationStatus, User } from '@prisma/client';
import { MESSAGE } from 'src/constants';
import { DbService } from 'src/db';
import { accepts, eq, generateQueryJobs } from 'src/lib';
import { QueryJobs } from 'src/types';

const MIN_VALUE = 0;
const SALARY_RANGE = 2;

const selectedUser = { id: true, firstName: true, lastName: true, email: true, userProfile: true };
const selectedJob = {
  id: true,
  position: true,
  salary: true,
  style: true,
  category: true,
  experienceLevel: true,
  location: true,
  jobDescriptions: true,
  jobType: true,
  qualifications: true,
  urgent: true,
};

@Injectable()
export class CompanyService {
  constructor(private readonly db: DbService) {}

  async getJobsByCompany(company: User['companyName'], query?: Omit<QueryJobs, 'company'>) {
    const salary_min = +query?.salary_min || MIN_VALUE;
    const salary_max = +query?.salary_max || MIN_VALUE;

    const filter = generateQueryJobs(query);

    const where = { company, ...filter };

    const result = await this.db.job.findMany({ where, orderBy: { createdAt: 'desc' } });

    if (eq(result.length, MIN_VALUE)) return accepts(MESSAGE.NOT_FOUND);

    const data = result.filter(({ salary }) => {
      const [min, max] = salary;

      const hasMinMax = eq(salary.length, SALARY_RANGE);

      if (hasMinMax && !eq(salary_max, MIN_VALUE)) return min >= salary_min && max <= salary_max;
      if (hasMinMax && eq(salary_max, MIN_VALUE)) return min >= salary_min;

      return min;
    });

    return accepts(MESSAGE.GET_SUCCESS, { data, total: data.length });
  }

  async getListApplied(company: string) {
    const filter = { job: { company }, applicationStatus: ApplicationStatus.applied };

    const [data, total] = await this.db.$transaction([
      this.db.appliedJob.findMany({
        where: filter,
        select: {
          id: true,
          applicationDate: true,
          applicationStatus: true,
          user: { select: selectedUser },
          job: { select: { id: true, position: true, experienceLevel: true } },
        },
        orderBy: { id: 'desc' },
      }),
      this.db.appliedJob.count({ where: filter }),
    ]);

    return accepts(MESSAGE.GET_SUCCESS, { data, total });
  }

  async getJobsAppliedById(company: string, appliedId: number) {
    const filter = {
      id: appliedId,
      job: { company },
    };

    const data = await this.db.appliedJob.findFirst({
      where: filter,
      select: {
        id: true,
        applicationDate: true,
        applicationStatus: true,
        rejectedDate: true,
        user: { select: selectedUser },
        job: { select: selectedJob },
      },
      orderBy: { id: 'desc' },
    });

    return accepts(MESSAGE.GET_SUCCESS, { data });
  }
}
