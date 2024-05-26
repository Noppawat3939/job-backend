import { ACTIVE } from 'src/constants';
import { Job, Role } from '@prisma/client';
import { WorkStyle as PCWorkStyle } from '@prisma/client';

const valueActive = Object.values(ACTIVE);

export type Provinces = {
  id: number;
  name_th: string;
  name_en: string;
  geography_id: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}[];

export type JwtPayload = { id: number; email: string; role: Role; iat: number; exp: number };

export type JwtDecode = { id: number; email: string; role: Role; iat: number; exp: number };

export type QueryApproveUsers = (typeof valueActive)[number];

export type WorkingStyle = typeof PCWorkStyle;

export type QuerySalary = { salary_min: number; salary_max: number };

export type QueryJobs = Partial<
  Omit<
    Job,
    | 'id'
    | 'companyProfile'
    | 'jobDescriptions'
    | 'qualifications'
    | 'benefits'
    | 'contracts'
    | 'updatedAt'
    | 'transports'
    | 'salary'
  > &
    QuerySalary
>;

export type QueryPublicJobs = Omit<
  QueryJobs,
  'active' | 'jobEndTime' | 'jobStartTime' | 'createdAt' | 'urgent'
>;

export enum Provider {
  Google = 'google',
}

export type GoogleUser = {
  providerId: string;
  email: string;
  name: string;
  picture: string;
  accessToken: string;
  provider: Provider;
};

export type Transform<T, K extends { [k in keyof T]: unknown }> = Omit<T, keyof K> & K;
