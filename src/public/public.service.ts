/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Provinces } from 'src/types';
import { Inject, Injectable } from '@nestjs/common';
import { accepts, exceptions, pretty } from 'src/lib';
import { industries, jobCategories } from './data';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { DbService } from 'src/db';
import { CACHE_KEY, MESSAGE } from 'src/constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Job } from '@prisma/client';

@Injectable()
export class PublicService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly db: DbService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}
  getAllIndustries() {
    const sortedIndustries = industries.sort((a, b) => a.id - b.id);

    return accepts(MESSAGE.GETTED_INDUSTRIES, {
      data: sortedIndustries,
      total: sortedIndustries.length,
    });
  }

  async getProvince() {
    const url = this.config.get('PROVINCE_JSON_URL');
    const { data: provinces } = await this.httpService.axiosRef.get<Provinces>(url);

    const mappedProvince = provinces.map((province) => ({
      id: province.id,
      name: { th: province.name_th, en: province.name_en },
      code: pretty(province.name_en).toUpperCase(),
    }));

    return accepts(MESSAGE.GETTED_PROVINCES, {
      data: mappedProvince,
      total: mappedProvince.length,
    });
  }

  async getJobById(id: number) {
    const data = await this.db.job
      .findFirstOrThrow({ where: { id } })
      .catch(() => exceptions.notFound(MESSAGE.JOB_NOT_FOUND));

    await this.cache.set(CACHE_KEY.PUBLIC_JOB, JSON.stringify([data]));

    return accepts(MESSAGE.GETTED_JOBS, { data });
  }

  getJobCateories() {
    const categories = jobCategories;

    return accepts(MESSAGE.GETTED_JOB_CATEGORIES, {
      data: categories,
      total: categories.length,
    });
  }
}
