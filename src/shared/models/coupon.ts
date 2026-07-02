export enum CouponDiscountType {
  FIXED = "FIXED",
  PERCENTAGE = "PERCENTAGE",
}

export interface ICoupon {
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minOrderValue: number;
  startsAt: string;
  hasStarted: boolean;
  isFinished: boolean;
  usageCount: number;
  endsAt: string | null;
  usageLimit: number | null;
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
