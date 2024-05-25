/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Provinces, QueryPublicJobs } from 'src/types';
import { Inject, Injectable } from '@nestjs/common';
import { accepts, exceptions, generateQueryJobs, pretty } from 'src/lib';
import { industries, jobCategories } from './data';
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

  async getJobs(query?: QueryPublicJobs) {
    const companyData: Array<{ id: number; companyName: string; userProfile: string }> = [];

    const cached = await this.cache.get<string>(CACHE_KEY.PUBLIC_JOBS);

    if (cached) {
      return accepts(MESSAGE.GETTED_JOBS, JSON.parse(cached));
    }

    const filter = generateQueryJobs(query);

    const where = { active: true, ...filter };

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
    };

    const jobs = await this.db.job.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: selected,
    });

    const companies = [...new Set(jobs.map((row) => row.company))];

    for (let i = 0; i < companies.length; i++) {
      const companyName = companies[i];

      const response = await this.db.user.findFirst({
        where: { companyName },
        select: { id: true, companyName: true, userProfile: true },
      });

      companyData.push(response);
    }

    const data = jobs.map((row) => {
      if (companyData.map((comp) => comp.companyName).includes(row.company)) {
        return { ...row, company: companyData?.[0] };
      }

      return row;
    });

    const response = { data, total: data.length };

    if (!cached) {
      await this.cache.set(CACHE_KEY.PUBLIC_JOBS, JSON.stringify(response));
    }

    return accepts(MESSAGE.GETTED_JOBS, response);
  }

  async getJob(id: number) {
    const data = await this.db.job
      .findFirstOrThrow({ where: { id } })
      .catch(() => exceptions.notFound(MESSAGE.JOB_NOT_FOUND));

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
