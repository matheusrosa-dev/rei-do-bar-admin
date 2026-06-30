import type { ICoupon } from "@shared/models";
import { api } from "../api";
import type {
  ActivateCoupon,
  CreateCoupon,
  DeactivateCoupon,
  GetCoupons,
  RemoveCoupon,
  UseCouponsService,
} from "./types";
import type { IPagination } from "@shared/interfaces";

export const useCouponsService: UseCouponsService = () => {
  const baseUrl = "/coupons";

  const getCoupons: GetCoupons = async (query) => {
    const response = await api.get<IPagination<ICoupon>>(baseUrl, {
      params: query,
    });

    return response.data.data;
  };

  const removeCoupon: RemoveCoupon = async (couponId) => {
    await api.delete(`${baseUrl}/${couponId}`);
  };

  const createCoupon: CreateCoupon = async (body) => {
    const response = await api.post<ICoupon>(baseUrl, body);
    return response.data.data;
  };

  const activateCoupon: ActivateCoupon = async (couponId) => {
    const response = await api.patch<ICoupon>(
      `${baseUrl}/${couponId}/activate`,
    );

    return response.data.data;
  };

  const deactivateCoupon: DeactivateCoupon = async (couponId) => {
    const response = await api.patch<ICoupon>(
      `${baseUrl}/${couponId}/deactivate`,
    );

    return response.data.data;
  };

  return {
    getCoupons: {
      fn: getCoupons,
      key: "get-coupons",
    },
    createCoupon,
    removeCoupon,
    deactivateCoupon,
    activateCoupon,
  };
};
