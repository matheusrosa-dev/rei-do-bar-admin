import type { ISettingCoupon } from "@shared/models";

const toAmount = (value: unknown): number => {
  const amount = Number(value);

  return Number.isFinite(amount) ? amount : 0;
};

export const parseSettingCoupon = (value: string): ISettingCoupon => {
  try {
    const parsed = JSON.parse(value) as Partial<ISettingCoupon>;

    return {
      discountValue: toAmount(parsed?.discountValue),
      minOrderValue: toAmount(parsed?.minOrderValue),
    };
  } catch {
    return { discountValue: 0, minOrderValue: 0 };
  }
};
