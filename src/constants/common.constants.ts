import { SubscriptionType } from '@prisma/client';

export const ACTIVE = {
  UN_APPROVE: 'un_approve',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const MAX_INSERT_DATA = {
  sub_A: 15,
  sub_B: 8,
  sub_C: 3, //free subscribe
} as Record<keyof typeof SubscriptionType, number>;
