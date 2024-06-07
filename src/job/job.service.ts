import { Injectable } from '@nestjs/common';
import { Prisma, Role, User } from '@prisma/client';
import { ACTIVE, MESSAGE } from 'src/constants';
import { DbService } from 'src/db';
import {
  accepts,
  checkLastUpdated,
  eq,
  exceptions,
  generateUpdateJob,
  transform,
  uniqueList,
} from 'src/lib';
import { CreateJobDto, UpdateJobDto } from 'src/schemas';
import type { KeysHeaders, QueryApproveUsers as QueryApproveJobs } from 'src/types';

@Injectable()
export class JobService {
  constructor(private readonly db: DbService) {}
  async getAll(keysHeaders: KeysHeaders) {
    const selected = {
      id: true,
      position: true,
      salary: true,
      location: true,
      urgent: true,
      style: true,
      company: true,
      updatedAt: true,
      createdAt: true,
      experienceLevel: true,
    } as Prisma.JobSelect;

    const [jobs, total] = await this.db.$transaction([
      this.db.job.findMany({
        orderBy: { createdAt: 'desc' },
        ...(!keysHeaders.token && { select: selected }),
      }),
      this.db.job.count(),
    ]);

    const companies = uniqueList(jobs.map((job) => job.company));
    const companyData: Pick<
      User,
      'id' | 'userProfile' | 'companyHistory' | 'companyName' | 'companyProfile'
    >[] = [];

    for (let i = 0; i < companies.length; i++) {
      const companyName = companies[i];

      const response = await this.db.user.findFirst({
        where: { companyName },
        select: {
          id: true,
          companyName: true,
          userProfile: true,
          companyProfile: true,
          companyHistory: true,
        },
      });

      companyData.push(response);
    }

    const data = jobs.map((row) => {
      const company = companyData.find((item) => eq(item.companyName, row.company));
      if (company) return { ...row, company };

      return row;
    });

    return accepts(MESSAGE.GET_SUCCESS, { data, total });
  }

  async getById(id: number, userId: number) {
    const job = await this.db.job
      .findFirstOrThrow({ where: { id } })
      .catch(() => exceptions.notFound(MESSAGE.NOT_FOUND));

    const appliedJob = await this.db.appliedJob.findFirst({
      where: { jobId: job.id, userId },
      take: -1,
    });
    const favoritedJob = await this.db.favoriteJob.findFirst({ where: { jobId: job.id, userId } });

    const data = {
      ...job,
      ...(appliedJob && { applicationStatus: appliedJob.applicationStatus }),
      ...(favoritedJob && { favoritedJob: true }),
    };

    return accepts(MESSAGE.GET_SUCCESS, { data });
  }

  async createJob(dto: CreateJobDto, user: User, isAllowedCheckLastest?: boolean) {
    const { companyName, companyProfile, industry } = user;

    const createLastest = await this.db.job.findMany({
      where: { company: user.companyName },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    if (createLastest.length > 0 && !isAllowedCheckLastest) {
      checkLastUpdated(-1, createLastest.at(0).createdAt);
    }

    const salary = transform.toNumberArray(dto.salary);

    const created = {
      position: dto.position,
      style: dto.style,
      company: companyName,
      companyProfile,
      industry,
      location: dto.location,
      salary,
      jobDescriptions: dto.jobDescriptions,
      qualifications: dto.qualifications,
      benefits: dto.benefits,
      contracts: dto.contracts,
      transports: dto.transports,
      jobType: dto.jobType,
      experienceLevel: dto.experienceLevel,
      category: dto.category,
    } as Prisma.JobCreateInput;

    const data = await this.db.job.create({
      data: created,
    });

    return accepts(MESSAGE.CREATE_SUCCESS, { data });
  }

  async updateJob(id: number, dto: UpdateJobDto, isAllowedCheckLastest?: boolean) {
    const job = await this.db.job
      .findFirstOrThrow({ where: { id } })
      .catch(() => exceptions.notFound(MESSAGE.NOT_FOUND));

    if (!job.active && !isAllowedCheckLastest) {
      checkLastUpdated(-10, job.updatedAt);
    }

    const salary = transform.toNumberArray(dto.salary);

    delete dto.salary;
    const updated = generateUpdateJob({ ...dto, salary });

    const data = await this.db.job.update({ where: { id }, data: updated });

    return accepts(MESSAGE.UPDATE_SUCCESS, { data });
  }

  async approveOrRejectJob(id: number, action: QueryApproveJobs) {
    const job = await this.db.job
      .findFirstOrThrow({ where: { id } })
      .catch(() => exceptions.notFound(MESSAGE.NOT_FOUND));

    const isApproved = eq(action, ACTIVE.APPROVED);
    const isResetActive = eq(action, ACTIVE.UN_APPROVE);

    if (isResetActive && eq(job.active, null)) return accepts('Job status is un approve');

    await this.db.job.update({
      where: { id },
      data: { active: isResetActive ? null : isApproved },
    });

    return accepts(MESSAGE.UPDATE_SUCCESS);
  }

  async deleteJob(id: number, user: User) {
    const job = await this.db.job
      .findFirstOrThrow({ where: { id } })
      .catch(() => exceptions.notFound(MESSAGE.NOT_FOUND));

    if (eq(user.role, Role.employer)) {
      if (eq(job.active, null)) {
        await this.db.job.delete({ where: { id } });

        return accepts(MESSAGE.DELETE_SUCCESS);
      } else {
        return exceptions.badRequest(MESSAGE.DELETE_FAILED);
      }
    }

    await this.db.job.delete({ where: { id } });

    return accepts(MESSAGE.DELETE_SUCCESS);
  }
}
