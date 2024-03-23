import * as bcrypt from 'bcryptjs';

export const hash = async (value: string) =>
  await bcrypt.hash(value, Number(process.env.SALT) || 10);

export const compareHash = async (value: string, target: string) =>
  await bcrypt.compare(value, target);

export const eq = <T>(value: T, target: T) => value === target;

export const less = (value: number, target: number) => value < target;

export const more = (value: number, target: number) => value > target;
