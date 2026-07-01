import type { SortDirection } from "@shared/interfaces";
import type { GetCouponsSortKey } from "@shared/services/coupons/types";
import {
  COUPON_SITUATIONS,
  type CouponSituationFilter,
} from "./coupon-situation";

type Search = {
  page?: number;
  searchTerm?: string;
  isActive?: boolean;
  situation?: CouponSituationFilter;
  sortKey?: GetCouponsSortKey;
  sortDirection?: SortDirection;
};

export const validateSearch = (search: Record<string, unknown>): Search => {
  const isActive = search.isActive as boolean | undefined;

  const page = Number(search.page) > 1 ? Number(search.page) : undefined;

  const searchTerm =
    typeof search.searchTerm === "string" ? search.searchTerm : undefined;

  const situation = COUPON_SITUATIONS.includes(
    search.situation as CouponSituationFilter,
  )
    ? (search.situation as CouponSituationFilter)
    : undefined;

  return {
    isActive,
    page,
    searchTerm,
    situation,

    ...formatSort(search),
  };
};

const formatSort = (search: Record<string, unknown>) => {
  const sortKey =
    typeof search.sortKey === "string"
      ? (search.sortKey as GetCouponsSortKey)
      : undefined;

  let sortDirection: SortDirection | undefined;

  if (sortKey) {
    sortDirection = search.sortDirection as SortDirection;
  }

  return {
    sortKey,
    sortDirection,
  };
};
