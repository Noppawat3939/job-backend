/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Provinces } from 'src/types';
import { Injectable } from '@nestjs/common';
import { accepts } from 'src/lib';
import { industries } from './data';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PublicService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}
  getIndustries() {
    const sortedIndustries = industries.sort((a, b) => a.id - b.id);

    return accepts('Getted industries data is successfully', {
      dataType: 'industry',
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
}
