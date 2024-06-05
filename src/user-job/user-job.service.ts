import dayjs from 'dayjs';
import { type Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ApplicationStatus, FavoriteJob, Job } from '@prisma/client';
import { CACHE_KEY, MESSAGE } from 'src/constants';
import { DbService } from 'src/db';
import { accepts, eq, exceptions } from 'src/lib';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UserJobService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly db: DbService,
  ) {}

  async getAppliedJobs(userId: number) {
    const cached = await this.cache.get<string>(CACHE_KEY.APPLIED_JOBS);

    if (cached) return accepts(MESSAGE.GET_SUCCESS, JSON.parse(cached));

    const selected = {
      id: true,
      job: true,
      applicationStatus: true,
      applicationDate: true,
      cancelledDate: true,
    };

    const filter = {
      userId,
      applicationStatus: {
        in: [
          ApplicationStatus.applied,
          ApplicationStatus.cancelled,
          ApplicationStatus.rejected,
          ApplicationStatus.offered,
        ],
      },
    };

    const applications = await this.db.appliedJob.findMany({
      where: filter,
      select: selected,
      orderBy: { applicationDate: 'desc' },
    });

    const response = { data: applications, total: applications.length };

    await this.cache.set(CACHE_KEY.APPLIED_JOBS, JSON.stringify(response));

    return accepts(MESSAGE.GET_SUCCESS, response);
  }

  async applyJob(jobId: number, userId: number) {
    const job = await this.db.job
      .findFirstOrThrow({ where: { id: jobId } })
      .catch(() => exceptions.notFound(MESSAGE.NOT_FOUND));

    const application = await this.db.appliedJob.findMany({
      where: { jobId: job.id },
      orderBy: { applicationDate: 'desc' },
      take: -1,
    });

    if (application.length && application[0].applicationStatus === ApplicationStatus.cancelled) {
      const id = application[0].id;

      await this.db.appliedJob.delete({ where: { id } });
    }

    const createdData = {
      jobId: job.id,
      userId,
      applicationDate: dayjs().toISOString(),
      applicationStatus: ApplicationStatus.applied,
    };

    await this.cache.del(CACHE_KEY.APPLIED_JOBS);

    const response = await this.db.appliedJob.create({ data: createdData });

    return accepts(MESSAGE.CREATE_SUCCESS, { data: response });
  }

  async cancelJob(applicationId: number, userId: number) {
    const appliedJob = await this.db.appliedJob
      .findFirstOrThrow({ where: { id: applicationId, userId } })
      .catch(() => exceptions.notFound(MESSAGE.NOT_FOUND));

    if (
      ![String(ApplicationStatus.cancelled), ApplicationStatus.applied].includes(
        appliedJob.applicationStatus,
      )
    )
      return exceptions.unProcessable(MESSAGE.NOT_ACCEPT);

    const filter = { id: appliedJob.id };
    const updatedData = {
      applicationStatus: ApplicationStatus.cancelled,
      cancelledDate: dayjs().toISOString(),
    };

    await this.cache.del(CACHE_KEY.APPLIED_JOBS);

    const response = await this.db.appliedJob.update({
      where: filter,
      data: updatedData,
    });

    return accepts(MESSAGE.UPDATE_SUCCESS, { data: response });
  }

  async updateStatusApplication(
    id: number,
    { status, company }: { company: string; status: ApplicationStatus },
  ) {
    const application = await this.db.appliedJob
      .findFirstOrThrow({ where: { id, job: { company } } })
      .catch(() => exceptions.notFound(MESSAGE.NOT_FOUND));

    const allowedStatus = {
      [ApplicationStatus.applied]: [ApplicationStatus.reviewing, ApplicationStatus.rejected],
      [ApplicationStatus.reviewing]: [
        ApplicationStatus.interviewing,
        ApplicationStatus.offering,
        ApplicationStatus.offered,
        ApplicationStatus.rejected,
      ],
      [ApplicationStatus.interviewing]: [
        ApplicationStatus.offering,
        ApplicationStatus.offered,
        ApplicationStatus.rejected,
      ],
      [ApplicationStatus.offering]: [ApplicationStatus.offered, ApplicationStatus.rejected],
      [ApplicationStatus.rejected]: [ApplicationStatus.rejected],
    } as Record<keyof typeof ApplicationStatus, (keyof typeof ApplicationStatus)[]>;

    const statusNotAllowed = !allowedStatus[application.applicationStatus].includes(status);

    if (statusNotAllowed) return exceptions.unProcessable(MESSAGE.NOT_ACCEPT);

    if (!Object.keys(ApplicationStatus).includes(status))
      return exceptions.unProcessable(MESSAGE.NOT_ACCEPT);

    const filter = { id: application.id };

    if (
      eq(status, ApplicationStatus.rejected) &&
      eq(application.applicationStatus, ApplicationStatus.rejected)
    )
      return accepts(MESSAGE.UPDATE_SUCCESS, { data: application });

    const updatedData = {
      applicationStatus: status,
      ...(eq(status, ApplicationStatus.rejected) && { rejectedDate: dayjs().toISOString() }),
    };

    const data = await this.db.appliedJob.update({ where: filter, data: updatedData });

    return accepts(MESSAGE.UPDATE_SUCCESS, { data });
  }

  async favoriteJob(jobId: number, userId: number) {
    await this.db.job
      .findFirstOrThrow({ where: { id: jobId } })
      .catch(() => exceptions.notFound(MESSAGE.NOT_FOUND));

    const favorited = await this.db.favoriteJob.findFirst({
      where: { userId, jobId },
      orderBy: { favoriteDate: 'desc' },
    });

    if (favorited) {
      const deleted = await this.db.favoriteJob.delete({
        where: { id: favorited.id, jobId, userId },
      });

      await this.cache.del(CACHE_KEY.FAVORITED_JOBS);

      return accepts(MESSAGE.DELETE_SUCCESS, { data: deleted });
    }

    const data = await this.db.favoriteJob.create({
      data: { jobId, userId, favoriteDate: dayjs().toISOString() },
    });

    await this.cache.del(CACHE_KEY.FAVORITED_JOBS);
    return accepts(MESSAGE.CREATE_SUCCESS, { data });
  }

  async getFavoriteJobs(userId: number) {
    const cached = await this.cache.get<string>(CACHE_KEY.FAVORITED_JOBS);

    if (cached) {
      return accepts(MESSAGE.GET_SUCCESS, JSON.parse(cached));
    }

    const data = await this.db.favoriteJob.findMany({
      where: { userId },
      orderBy: { favoriteDate: 'desc' },
    });

    const response = [] as (FavoriteJob & { job: Job })[];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];

      const job = await this.db.job.findFirst({
        where: { id: row.jobId },
      });

      const result = { ...row, job };
      response.push(result);
    }

    await this.cache.set(
      CACHE_KEY.FAVORITED_JOBS,
      JSON.stringify({ data: response, total: response.length }),
    );

    return accepts(MESSAGE.GET_SUCCESS, { data: response, total: response.length });
  }
  async deleteApplication(id: number, userId: number) {
    const application = await this.db.appliedJob
      .findFirstOrThrow({ where: { id, userId }, select: { id: true, applicationStatus: true } })
      .catch(() => exceptions.notFound(MESSAGE.NOT_FOUND));

    const allowedStatus = [
      ApplicationStatus.applied,
      ApplicationStatus.cancelled,
    ] as (keyof typeof ApplicationStatus)[];

    if (!allowedStatus.includes(application.applicationStatus))
      return exceptions.unProcessable(MESSAGE.NOT_ACCEPT);

    await this.db.appliedJob.delete({ where: { id } });

    return accepts(MESSAGE.DELETE_SUCCESS);
  }
}
