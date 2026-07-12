import { yupResolver } from "@hookform/resolvers/yup";
import { SettingType } from "@shared/models";
import type { Resolver } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object({
  type: yup.mixed<SettingType>().oneOf(Object.values(SettingType)).required(),
  value: yup.string().trim().optional(),
});

export type Form = yup.InferType<typeof schema>;

export const defaultValues: Form = {
  type: SettingType.TEXT,
  value: "",
};

export const resolver = yupResolver(schema) as Resolver<Form>;
