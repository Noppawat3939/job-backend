import dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { ApplicationStatus } from '@prisma/client';
import { MESSAGE } from 'src/constants';
import { DbService } from 'src/db';
import { accepts, exceptions } from 'src/lib';

@Injectable()
export class UserJobService {
  constructor(private readonly db: DbService) {}

  async getAppliedJobs(userId: number) {
    const selected = { id: true, job: true, applicationStatus: true, applicationDate: true };

    const applications = await this.db.appliedJob.findMany({
      where: {
        userId,
        applicationStatus: {
          in: [
            ApplicationStatus.applied,
            ApplicationStatus.cancelled,
            ApplicationStatus.rejected,
            ApplicationStatus.offered,
          ],
        },
      },
      select: selected,
      orderBy: { applicationDate: 'desc' },
    });

    return accepts(MESSAGE.GETTED_APPLIED_JOBS, { data: applications, total: applications.length });
  }

  async applyJob(jobId: number, userId: number) {
    const job = await this.db.job
      .findFirstOrThrow({ where: { id: jobId } })
      .catch(() => exceptions.notFound(MESSAGE.JOB_NOT_FOUND));

    const applicationRejected = await this.db.appliedJob.findFirst({
      where: { jobId: job.id, applicationStatus: { not: ApplicationStatus.rejected } },
      orderBy: { applicationDate: 'desc' },
    });

    if (applicationRejected) return exceptions.unProcessable(MESSAGE.APPLIED_JOB_STATUS_NOT_ACCEPT);

    const response = await this.db.appliedJob.create({
      data: {
        jobId: job.id,
        userId,
        applicationDate: dayjs().toISOString(),
        applicationStatus: ApplicationStatus.applied,
      },
    });

    return accepts(MESSAGE.APPLIED_JOB, { data: response });
  }

  async cancelJob(jobId: number, userId: number) {
    const appliedJob = await this.db.appliedJob
      .findFirstOrThrow({ where: { jobId, userId } })
      .catch(() => exceptions.notFound(MESSAGE.JOB_NOT_FOUND));

    if (
      ![String(ApplicationStatus.cancelled), ApplicationStatus.applied].includes(
        appliedJob.applicationStatus,
      )
    )
      return exceptions.unProcessable(MESSAGE.APPLIED_JOB_STATUS_NOT_ACCEPT);

    const response = await this.db.appliedJob.update({
      where: { id: appliedJob.id },
      data: { applicationStatus: ApplicationStatus.cancelled },
    });

    return accepts(MESSAGE.CANCELLED_APPLICATION_JOB, { data: response });
  }

  async updateStatusApplication(id: number) {
    const application = await this.db.appliedJob
      .findFirstOrThrow({ where: { id } })
      .catch(() => exceptions.notFound(MESSAGE.JOB_NOT_FOUND));

    const mappingUpdateStatus = {
      applied: ApplicationStatus.interviewing,
      interviewing: ApplicationStatus.offering,
      offering: ApplicationStatus.offered,
    } as Record<keyof typeof ApplicationStatus, keyof typeof ApplicationStatus>;

    if (!Object.keys(mappingUpdateStatus).includes(application.applicationStatus))
      return exceptions.unProcessable(MESSAGE.APPLIED_JOB_STATUS_NOT_ACCEPT);

    const response = await this.db.appliedJob.update({
      where: { id: application.id },
      data: { applicationStatus: mappingUpdateStatus[application.applicationStatus] },
    });

    return accepts(MESSAGE.UPDATED_STATUS_APPLICATION_JOB, { data: response });
  }
}
