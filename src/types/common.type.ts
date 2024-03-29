import { Role } from '@prisma/client';
import { WorkStyle as PCWorkStyle } from '@prisma/client';

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

export type QueryApproveUsers = 'approved' | 'un_approve' | 'rejected';

export type WorkingStyle = typeof PCWorkStyle;
