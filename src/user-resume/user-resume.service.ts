import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
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
    ]);
    const cached = await this.cache.get<string>(CACHE_KEY.USER_RESUME);

    if (cached) await this.cache.del(CACHE_KEY.USER_RESUME);

    const maxInsert = MAX_INSERT_DATA[subscribe?.type];

    const createParams = { userId: user.id, ...dto } as Prisma.UserResumeCreateInput;

    if (
      (subscribe && resumes?.length > maxInsert) ||
      (!subscribe && resumes?.length >= MAX_INSERT_DATA.sub_C)
    )
      return exceptions.unProcessable('Limit exceed create');

    const result = await this.db.userResume.create({ data: createParams });

    return accepts(MESSAGE.CREATE_SUCCESS, { data: result });
  }

  async updateUserResume(id: number, user: User, dto: UpdateResumeDto) {
    const data = await this.db.userResume
      .findFirstOrThrow({ where: { id, userId: user.id } })
      .catch(() => exceptions.notFound(MESSAGE.NOT_FOUND));

    const cached = await this.cache.get<string>(CACHE_KEY.USER_RESUME);

    if (cached) await this.cache.del(CACHE_KEY.USER_RESUME);
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
}
