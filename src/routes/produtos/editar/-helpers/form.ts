import { yupResolver } from "@hookform/resolvers/yup";
import type { Resolver } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object({
  name: yup.string().trim().required("Campo obrigatório"),
  description: yup.string().optional(),
  imageUrl: yup.string().url("Url inválida").required("Campo obrigatório"),
  price: yup.number().required("Campo obrigatório").min(100, "Preço inválido"),
  stock: yup.number().required("Campo obrigatório"),
  categoryId: yup.string().required("Campo obrigatório").nullable(),
  isActive: yup.boolean().required("Campo obrigatório"),
});

export type Form = yup.InferType<typeof schema>;

export const defaultValues: Form = {
  name: "",
  imageUrl: "",
  categoryId: null,
  price: 0,
  stock: 0,
  isActive: false,
};

export const resolver = yupResolver(schema) as Resolver<Form>;
