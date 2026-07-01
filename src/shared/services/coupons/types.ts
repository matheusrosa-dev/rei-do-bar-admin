import type { IPagination, SortDirection } from "@shared/interfaces";
import type { CouponDiscountType, ICoupon } from "@shared/models";

export type GetCouponsSortKey =
  | "discountValue"
  | "minOrderValue"
  | "usageCount";

export type GetCoupons = (query?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  isActive?: boolean;
  hasStarted?: boolean;
  isFinished?: boolean;
  sortKey?: GetCouponsSortKey;
  sortDirection?: SortDirection;
}) => Promise<IPagination<ICoupon>>;

export type RemoveCoupon = (couponId: string) => Promise<void>;

export type CreateCouponBody = {
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minOrderValue: number;
  startsAt: Date;
  endsAt?: Date;
  usageLimit?: number;
};

export type CreateCoupon = (body: CreateCouponBody) => Promise<ICoupon>;

export type ActivateCoupon = (couponId: string) => Promise<ICoupon>;

export type DeactivateCoupon = (couponId: string) => Promise<ICoupon>;

export type UseCouponsService = () => {
  getCoupons: {
    fn: GetCoupons;
    key: string;
  };
  removeCoupon: RemoveCoupon;
  createCoupon: CreateCoupon;
  activateCoupon: ActivateCoupon;
  deactivateCoupon: DeactivateCoupon;
};
