import { yupResolver } from "@hookform/resolvers/yup";
import type { Resolver } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object({
  value: yup.string().trim().optional(),
});

export type Form = yup.InferType<typeof schema>;

export const defaultValues: Form = {
  value: "",
};

export const resolver = yupResolver(schema) as Resolver<Form>;
