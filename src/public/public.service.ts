/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Provinces } from 'src/types';
import { Inject, Injectable } from '@nestjs/common';
import { accepts, exceptions, pretty } from 'src/lib';
import { SUBSCRIBE_DATA, industries, jobCategories, testimonials } from './data';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { DbService } from 'src/db';
import { CACHE_KEY, MESSAGE } from 'src/constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

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

    return accepts(MESSAGE.GET_SUCCESS, {
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

    return accepts(MESSAGE.GET_SUCCESS, {
      data: mappedProvince,
      total: mappedProvince.length,
    });
  }

  async getJobById(id: number) {
    const data = await this.db.job
      .findFirstOrThrow({ where: { id } })
      .catch(() => exceptions.notFound(MESSAGE.NOT_FOUND));

    await this.cache.set(CACHE_KEY.PUBLIC_JOB, JSON.stringify([data]));

    return accepts(MESSAGE.GET_SUCCESS, { data });
  }

  getJobCateories() {
    const categories = jobCategories;

    return accepts(MESSAGE.GET_SUCCESS, {
      data: categories,
      total: categories.length,
    });
  }

  getTesimonials() {
    const data = testimonials;

    return accepts(MESSAGE.GET_SUCCESS, { data, total: data.length });
  }

  async getResumeTemplates() {
    const data = await this.db.resumeTemplate.findMany();

    return accepts(MESSAGE.GET_SUCCESS, { data, total: data.length });
  }

  getSubscribe(query?: { plan: string }) {
    let result: typeof SUBSCRIBE_DATA;

    const data = SUBSCRIBE_DATA;

    if (query.plan) {
      result = [data.find((item) => item.plan === query.plan)];
    } else {
      result = data;
    }

    return accepts(MESSAGE.GET_SUCCESS, { data: result });
  }
}
