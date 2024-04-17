/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Provinces } from 'src/types';
import { Injectable } from '@nestjs/common';
import { accepts, exceptions } from 'src/lib';
import { industries } from './data';
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

    return accepts('Getted industries data is successfully', {
      data: sortedIndustries,
      total: sortedIndustries.length,
    });
  }

  async getProvince() {
    const url = this.config.get('PROVINCE_JSON_URL');
    const { data } = await this.httpService.axiosRef.get<Provinces>(url);

    const mappedProvince = data.map((data) => {
      const { deleted_at, created_at, updated_at, ...rest } = data;

      return { ...rest, province_key: data.name_en.replaceAll(' ', '_').toLowerCase() };
    });

    return accepts('Getted province data is successfully', {
      dataType: 'province',
      data: mappedProvince,
      total: mappedProvince.length,
    });
  }

  async getJobs() {
    const data = await this.db.job.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        position: true,
        salary: true,
        location: true,
        urgent: true,
        style: true,
        company: true,
        updatedAt: true,
        createdAt: true,
      },
    });

    return accepts(MESSAGE.GETTED_JOBS, { data, total: data.length });
  }

  async getJob(id: number) {
    const data = await this.db.job
      .findFirstOrThrow({ where: { id } })
      .catch(() => exceptions.badRequest(MESSAGE.JOB_NOT_FOUND));

    return accepts(MESSAGE.GETTED_JOBS, { data });
  }
}
