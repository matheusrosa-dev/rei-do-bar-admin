import { yupResolver } from "@hookform/resolvers/yup";
import type { Resolver } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object({
  name: yup
    .string()
    .trim()
    .max(100, "Máximo 100 caracteres")
    .required("Campo obrigatório"),
  allProductsImageUrl: yup
    .string()
    .url("Url inválida")
    .required("Campo obrigatório"),
  promotionsImageUrl: yup
    .string()
    .url("Url inválida")
    .required("Campo obrigatório"),
});

export type Form = yup.InferType<typeof schema>;

export const defaultValues: Form = {
  name: "",
  allProductsImageUrl: "",
  promotionsImageUrl: "",
};

export const resolver = yupResolver(schema) as Resolver<Form>;
