export enum CouponDiscountType {
  FIXED = "FIXED",
  PERCENTAGE = "PERCENTAGE",
}

export interface ICoupon {
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minOrderValue: number;
  startsAt: Date;
  hasStarted: boolean;
  isFinished: boolean;
  usageCount: number;
  endsAt: Date | null;
  usageLimit: number | null;
  id: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
