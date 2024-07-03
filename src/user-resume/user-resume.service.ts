import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Prisma, ResumeTemplate, User, UserResume } from '@prisma/client';
import { Cache } from 'cache-manager';
import { CACHE_KEY, MAX_INSERT_DATA, MESSAGE } from 'src/constants';
import { DbService } from 'src/db';
import { accepts, exceptions } from 'src/lib';
import { UpdateResumeDto } from 'src/schemas';

@Injectable()
export class UserResumeService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly db: DbService,
  ) {}

  async getTemplates() {
    let result: { id: number; image: string }[];

    const cached = false;
    await this.cache.get<string>(CACHE_KEY.RESUME_TEMPLATES);

    if (cached) {
      result = JSON.parse(cached);
    } else {
      const data = await this.db.resumeTemplate.findMany();
      await this.cache.set(CACHE_KEY.RESUME_TEMPLATES, JSON.stringify(data));

      result = data;
    }

    return accepts(MESSAGE.GET_SUCCESS, { data: result, total: result.length });
  }

  async insertUserResume(user: User, dto: UpdateResumeDto) {
    const [subscribe, resumes] = await Promise.all([
      this.db.subscription.findFirst({
        where: { userEmail: user.email },
      }),
      this.db.userResume.findMany({ where: { userId: user.id }, select: { id: true } }),
    ]).finally(async () => {
      const cached = await this.cache.get<string>(CACHE_KEY.USER_RESUME);

      if (cached) await this.cache.del(CACHE_KEY.USER_RESUME);
    });

    const maxInsert = MAX_INSERT_DATA[subscribe?.type];

    const createParams = { userId: user.id, ...dto } as Prisma.UserResumeCreateInput;

    if ((subscribe && resumes?.length >= maxInsert) || (!subscribe && resumes?.length >= 1))
      return exceptions.unProcessable('Limit exceed create');

    const result = await this.db.userResume.create({ data: createParams });

    return accepts(MESSAGE.CREATE_SUCCESS, { data: result });
  }

  async updateUserResume(id: number, user: User, dto: UpdateResumeDto) {
    const data = await this.db.userResume
      .findFirstOrThrow({ where: { id, userId: user.id } })
      .catch(() => exceptions.notFound(MESSAGE.NOT_FOUND))
      .finally(async () => {
        const cached = await this.cache.get<string>(CACHE_KEY.USER_RESUME);

        if (cached) await this.cache.del(CACHE_KEY.USER_RESUME);
      });

    const updateParams = {
      templateTitle: dto.templateTitle,
      templateData: dto.templateData,
    } as Prisma.UserResumeUpdateInput;

    const result = await this.db.userResume.update({
      data: updateParams,
      where: { id: data.id },
    });

    return accepts(MESSAGE.UPDATE_SUCCESS, { data: result });
  }

  async updatePublicUserResume(id: number, user: User) {
    const resume = await this.db.userResume
      .findFirstOrThrow({ where: { id, userId: user.id } })
      .catch(() => exceptions.notFound(MESSAGE.NOT_FOUND))
      .finally(async () => {
        const cached = await this.cache.get<string>(CACHE_KEY.USER_RESUME);

        if (cached) await this.cache.del(CACHE_KEY.USER_RESUME);
      });

    if (!resume.active) {
      await this.db.userResume.update({ where: { id: resume.id }, data: { active: true } });
    }

    return accepts(MESSAGE.UPDATE_SUCCESS);
  }

  async deleteUserResume(id: number, user: User) {
    await this.db.userResume
      .findFirstOrThrow({ where: { id, userId: user.id } })
      .then(async () => {
        await this.db.userResume.delete({ where: { id } });

        return accepts(MESSAGE.DELETE_SUCCESS);
      })
      .catch(() => exceptions.notFound(MESSAGE.NOT_FOUND))
      .finally(async () => {
        const cached = await this.cache.get<string>(CACHE_KEY.USER_RESUME);

        if (cached) await this.cache.del(CACHE_KEY.USER_RESUME);
      });
  }

  async getUserResumes(userId: number) {
    let result: UserResume[];
    const cached = await this.cache.get<string>(CACHE_KEY.USER_RESUME);

    if (cached) {
      result = JSON.parse(cached);
    } else {
      const data = await this.db.userResume.findMany({
        where: { userId },
        include: { template: true },
        orderBy: { createdAt: 'desc' },
      });

      await this.cache.set(CACHE_KEY.USER_RESUME, JSON.stringify(data), 30000);

      result = data;
    }

    return accepts(MESSAGE.GET_SUCCESS, { data: result, total: result.length });
  }

  async getResume(userId: number, resumeId: number) {
    let result: UserResume & { template?: ResumeTemplate };
    const cached = await this.cache.get<string>(CACHE_KEY.USER_RESUME);

    if (cached) {
      const parsedCache: (UserResume & { template: ResumeTemplate })[] = JSON.parse(cached);

      const found = parsedCache.find((data) => data.userId === userId && data.id === resumeId);
      delete found.template;

      result = found;
    } else {
      result = await this.db.userResume.findFirst({ where: { userId, id: resumeId } });
    }

    return accepts(MESSAGE.GET_SUCCESS, { data: result });
  }
}
