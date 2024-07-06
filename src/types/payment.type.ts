export type CreateQRSourceDto = {
  code_key: string;
  value: number;
  period: 'per_year' | 'per_month';
};
