import { Role } from '@prisma/client';

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
