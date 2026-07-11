import { yupResolver } from "@hookform/resolvers/yup";
import { SettingType, type ISetting } from "@shared/models";
import type { Resolver } from "react-hook-form";
import * as yup from "yup";
import { parseSettingCoupon } from "../../-helpers";

const schema = yup.object({
  type: yup.mixed<SettingType>().oneOf(Object.values(SettingType)).required(),
  value: yup.string().trim().optional(),
  discountValue: yup
    .number()
    .transform((value) => (Number.isNaN(value) ? 0 : value))
    .when("type", ([type], field) =>
      type === SettingType.COUPON
        ? field
            .min(1, "Informe um valor válido")
            .required("Informe o valor do desconto")
        : field,
    ),
  minOrderValue: yup
    .number()
    .transform((value) => (Number.isNaN(value) ? 0 : value))
    .min(0, "Informe um valor válido"),
});

export type Form = yup.InferType<typeof schema>;

export const defaultValues: Form = {
  type: SettingType.TEXT,
  value: "",
  discountValue: 0,
  minOrderValue: 0,
};

export const resolver = yupResolver(schema) as Resolver<Form>;

export const settingToForm = (setting: ISetting): Form => {
  if (setting.type !== SettingType.COUPON) {
    return {
      type: setting.type,
      value: setting.value,
    };
  }

  const coupon = parseSettingCoupon(setting.value);

  return {
    type: setting.type,
    value: "",
    discountValue: coupon.discountValue,
    minOrderValue: coupon.minOrderValue,
  };
};
