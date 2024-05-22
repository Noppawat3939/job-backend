import { Injectable } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { ACTIVE, MESSAGE } from 'src/constants';
import { DbService } from 'src/db';
import { accepts, checkLastUpdated, eq, exceptions, transform } from 'src/lib';
import { CreateJobDto, UpdateJobDto } from 'src/schemas';
import type { QueryApproveUsers as QueryApproveJobs } from 'src/types';

@Injectable()
export class JobService {
  constructor(private readonly db: DbService) {}
  async getAll() {
    const data = await this.db.job.findMany({ orderBy: { createdAt: 'desc' } });

    return accepts(MESSAGE.GETTED_JOBS, { data, total: data.length });
  }

  async getById(id: number, userId: number) {
    const job = await this.db.job
      .findFirstOrThrow({ where: { id } })
      .catch(() => exceptions.notFound(MESSAGE.JOB_NOT_FOUND));

    const appliedJob = await this.db.appliedJob.findFirst({ where: { jobId: job.id, userId } });
    const favoritedJob = await this.db.favoriteJob.findFirst({ where: { jobId: job.id, userId } });

    const data = {
      ...job,
      ...(appliedJob && { applicationStatus: appliedJob.applicationStatus }),
      ...(favoritedJob && { favoritedJob: true }),
    };

    return accepts(MESSAGE.GETTED_JOBS, { data });
  }

  async createJob(dto: CreateJobDto, user: User, isAllowedCheckLastest?: boolean) {
    const { companyName, companyProfile, industry } = user;

    const createLastest = await this.db.job.findMany({
      where: { company: user.companyName },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    if (createLastest.length > 0 && !isAllowedCheckLastest) {
      checkLastUpdated(-10, createLastest.at(0).createdAt);
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
    };

    const data = await this.db.job.create({
      data: created,
    });

    return accepts(MESSAGE.JOB_CREATED, { data });
  }

  async updateJob(id: number, dto: UpdateJobDto, isAllowedCheckLastest?: boolean) {
    const job = await this.db.job
      .findFirstOrThrow({ where: { id } })
      .catch(() => exceptions.notFound(MESSAGE.JOB_NOT_FOUND));

    if (!job.active && !isAllowedCheckLastest) {
      checkLastUpdated(-10, job.updatedAt);
    }

    const salary = transform.toNumberArray(dto.salary);

    const updated = {
      ...(dto.position && { position: dto.position }),
      ...(dto.style && { style: dto.style }),
      ...(dto.location && { location: dto.location }),
      ...(dto.salary && { salary }),
      ...(dto.jobDescriptions && { jobDescriptions: dto.jobDescriptions }),
      ...(dto.qualifications && { qualifications: dto.qualifications }),
      ...(dto.benefits && { benefits: dto.benefits }),
      ...(dto.contracts && { contracts: dto.contracts }),
      ...(dto.transports && { transports: dto.transports }),
      ...(dto.jobType && { jobType: dto.jobType }),
      ...(dto.experienceLevel && { experienceLevel: dto.experienceLevel }),
      ...(dto.category && { category: dto.category }),
    };

    const data = await this.db.job.update({
      where: { id },
      data: updated,
    });

    return accepts(MESSAGE.JOB_INFO_UPDATED, { data });
  }

  async approveOrRejectJob(id: number, action: QueryApproveJobs) {
    const job = await this.db.job
      .findFirstOrThrow({ where: { id } })
      .catch(() => exceptions.notFound(MESSAGE.JOB_NOT_FOUND));

    const isApproved = eq(action, ACTIVE.APPROVED);
    const isResetActive = eq(action, ACTIVE.UN_APPROVE);

    if (isResetActive && eq(job.active, null)) return accepts('Job status is un approve');

    await this.db.job.update({
      where: { id },
      data: { active: isResetActive ? null : isApproved },
    });

    return accepts(
      isResetActive
        ? MESSAGE.RESETED_ACTIVE
        : isApproved
          ? MESSAGE.JOB_APPROVED
          : MESSAGE.JOB_REJECTED,
    );
  }

  async deleteJob(id: number, user: User) {
    const job = await this.db.job
      .findFirstOrThrow({ where: { id } })
      .catch(() => exceptions.notFound(MESSAGE.JOB_NOT_FOUND));

    if (eq(user.role, Role.employer)) {
      if (eq(job.active, null)) {
        await this.db.job.delete({ where: { id } });

        return accepts(MESSAGE.JOB_DELETED);
      } else {
        return exceptions.badRequest("Can't delete approved job");
      }
    }

    await this.db.job.delete({ where: { id } });

    return accepts(MESSAGE.JOB_DELETED);
  }
}
