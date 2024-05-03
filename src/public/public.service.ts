/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Provinces, QueryPublicJobs } from 'src/types';
import { Injectable } from '@nestjs/common';
import { accepts, exceptions, generateQueryJobs, pretty } from 'src/lib';
import { industries, jobCategories } from './data';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { DbService } from 'src/db';
import { MESSAGE } from 'src/constants';

@Injectable()
export class PublicService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly db: DbService,
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

    const data = await this.db.job.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: selected,
    });

    return accepts(MESSAGE.GETTED_JOBS, { data, total: data.length });
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
