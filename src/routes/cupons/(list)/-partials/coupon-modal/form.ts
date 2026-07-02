import { yupResolver } from "@hookform/resolvers/yup";
import { CouponDiscountType, type ICoupon } from "@shared/models";
import type { Resolver } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object({
  code: yup.string().trim().required("Informe o código"),
  discountType: yup
    .string()
    .oneOf([CouponDiscountType.FIXED, CouponDiscountType.PERCENTAGE])
    .required("Campo obrigatório"),
  discountValue: yup
    .number()
    .transform((value) => (Number.isNaN(value) ? undefined : value))
    .min(1, "Informe um valor válido")
    .when("discountType", ([discountType], field) =>
      discountType === CouponDiscountType.PERCENTAGE
        ? field.max(100, "Máximo 100%")
        : field,
    )
    .required("Informe o valor do desconto"),
  minOrderValue: yup
    .number()
    .transform((value) => (Number.isNaN(value) ? 0 : value))
    .min(0)
    .required(),
  startsAt: yup.date().required("Informe a data de início"),
  endsAt: yup
    .date()
    .test(
      "after-start",
      "A data final deve ser posterior ao início",
      (value, context) => {
        if (!value) return true;
        const { startsAt } = context.parent;

        if (!value || !startsAt) return true;

        return value >= new Date(startsAt);
      },
    ),
  usageLimit: yup
    .number()
    .transform((value) => (Number.isNaN(value) ? undefined : value))
    .integer("Valor inválido")
    .min(1, "Mínimo 1"),
});

export type Form = yup.InferType<typeof schema>;

export const defaultValues: Form = {
  code: "",
  discountType: CouponDiscountType.FIXED,
  discountValue: 0,
  minOrderValue: 0,
  startsAt: new Date(),
};

export const resolver = yupResolver(schema) as Resolver<Form>;

export const couponToForm = (coupon: ICoupon): Form => ({
  code: coupon.code,
  discountType: coupon.discountType,
  discountValue: coupon.discountValue,
  minOrderValue: coupon.minOrderValue,
  startsAt: new Date(coupon.startsAt),
  endsAt: coupon.endsAt ? new Date(coupon.endsAt) : undefined,
  usageLimit: coupon.usageLimit ?? undefined,
});
