import { formatPrice } from "@shared/helpers/number";
import { CouponDiscountType } from "@shared/models";

export const DISCOUNT_TYPE_LABELS: Record<CouponDiscountType, string> = {
  [CouponDiscountType.FIXED]: "Valor fixo",
  [CouponDiscountType.PERCENTAGE]: "Porcentagem",
};

export const DISCOUNT_TYPE_OPTIONS = Object.values(CouponDiscountType).map(
  (type) => ({ value: type, label: DISCOUNT_TYPE_LABELS[type] }),
);

export const formatDiscountValue = (
  type: CouponDiscountType,
  value: number,
) => {
  if (type === CouponDiscountType.PERCENTAGE) {
    return `${value}%`;
  }

  return formatPrice(value);
};
