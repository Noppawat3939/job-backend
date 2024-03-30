import * as bcrypt from 'bcryptjs';

export const hash = async (value: string) =>
  await bcrypt.hash(value, Number(process.env.SALT) || 10);

export const compareHash = async (value: string, target: string) =>
  await bcrypt.compare(value, target);

export const eq = <T>(value: T, target: T) => value === target;

export const less = (value: number, target: number) => value < target;

export const more = (value: number, target: number) => value > target;

export const orHas = <T>(values: T[]) => [...values].some(Boolean);

export const exclude = <T extends any[]>(data: T, excludeKey: (keyof T[number])[]) => {
  const excluded = data.map((item) => {
    const filtered = {};

    for (const key in item) {
      if (!excludeKey.includes(key)) {
        filtered[key] = item[key];
      }
    }
    return filtered;
  });

  return excluded;
};

export const transform = {
  toNumberArray: (values: any) =>
    Array.isArray(values) ? values.map((value) => Number(value)) : [Number(values)],
};
