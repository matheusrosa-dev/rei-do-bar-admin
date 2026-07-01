import type { ICoupon } from "@shared/models";

type CouponSituation = {
  label: string;
  variant: "active" | "inactive" | "alert";
};

export const getCouponSituation = (
  coupon: Pick<ICoupon, "hasStarted" | "isFinished">,
): CouponSituation => {
  if (coupon.isFinished) {
    return { label: "Finalizado", variant: "inactive" };
  }

  if (!coupon.hasStarted) {
    return { label: "Agendado", variant: "alert" };
  }

  return { label: "Vigente", variant: "active" };
};

export const COUPON_SITUATIONS = ["scheduled", "ongoing", "finished"] as const;

export type CouponSituationFilter = (typeof COUPON_SITUATIONS)[number];

export const SITUATION_FILTER_OPTIONS: {
  value: CouponSituationFilter;
  label: string;
}[] = [
  { value: "scheduled", label: "Agendado" },
  { value: "ongoing", label: "Vigente" },
  { value: "finished", label: "Finalizado" },
];

export const situationToQuery = (
  situation?: CouponSituationFilter,
): { hasStarted?: boolean; isFinished?: boolean } => {
  switch (situation) {
    case "scheduled":
      return { hasStarted: false };
    case "ongoing":
      return { hasStarted: true, isFinished: false };
    case "finished":
      return { isFinished: true };
    default:
      return {};
  }
};
