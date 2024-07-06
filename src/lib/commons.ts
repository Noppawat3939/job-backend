import * as bcrypt from 'bcryptjs';
import dayjs from 'dayjs';

export const hash = async (value: string) =>
  await bcrypt.hash(value, Number(process.env.SALT) || 10);

export const compareHash = async (value: string, target: string) =>
  await bcrypt.compare(value, target);

export const eq = <T>(value: T, target: T) => value === target;

/**
 *
 * @example less(3,5)
 * @returns true
 */
export const less = (value: number, target: number) => value < target;

/**
 *
 * @example more(5,3)
 * @returns true
 */
export const more = (value: number, target: number) => value > target;

/**
 *
 * @example orHas(["text1", "text2", ""])
 * @returns false
 * @example orHas([true, true, true])
 * @returns true
 */
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

/**
 *
 * @example transform.toNumberArray(["123"])
 * @example transform.toNumberArray("123")
 * @returns [123]
 */
export const transform = {
  toNumberArray: (values: any) =>
    Array.isArray(values) ? values.map((value) => Number(value)) : [Number(values)],
};

/**
 *
 * @example pretty("Hello world")
 * @returns "Hello_world"
 */
export const pretty = (text: string) => text.replaceAll(' ', '_');

/**
 *
 * @example unPretty("Hello_world")
 * @returns "Hello world"
 */
export const unPretty = (text: string) => text.replaceAll('_', ' ');

/**
 *
 * @example uniqueList(["1","1","2","3","4"])
 * @returns ["1","2","3","4"]
 */
export const uniqueList = <T extends string | number>(values: T[]) => [...new Set(values)];

/**
 *
 * @example generateCode()
 * @returns 182910
 */
export const generateCode = () => {
  const randomNum = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

  return randomNum.toString().padStart(6, '0');
};

export const generateRefNo = (len = 8) => {
  let refNo = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < len; i++) {
    refNo += chars[Math.floor(Math.random() * chars.length)];
  }

  return refNo;
};
