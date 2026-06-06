import { yupResolver } from "@hookform/resolvers/yup";
import type { Resolver } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object({
  name: yup.string().trim().required("Campo obrigatório"),
  description: yup.string().optional(),
  imageUrl: yup.string().url("Url inválida").required("Campo obrigatório"),
  price: yup.number().required("Campo obrigatório").min(100, "Preço inválido"),
  categoryId: yup.string().required("Campo obrigatório"),
});

export type Form = yup.InferType<typeof schema>;

export const defaultValues: Form = {
  name: "",
  imageUrl: "",
  categoryId: "",
  price: 0,
};

export const resolver = yupResolver(schema) as Resolver<Form>;
