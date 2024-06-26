import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_KEY, MESSAGE } from 'src/constants';
import { DbService } from 'src/db';
import { accepts } from 'src/lib';

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
}
