import { yupResolver } from "@hookform/resolvers/yup";
import { CouponDiscountType } from "@shared/models";
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
  startsAt: yup.string().required("Informe a data de início"),
  endsAt: yup
    .string()
    .test(
      "after-start",
      "A data final deve ser posterior ao início",
      (value, context) => {
        if (!value) return true;
        const { startsAt } = context.parent;
        return !startsAt || new Date(value) >= new Date(startsAt);
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
  startsAt: "",
  endsAt: undefined,
  usageLimit: undefined,
};

export const resolver = yupResolver(schema) as Resolver<Form>;
