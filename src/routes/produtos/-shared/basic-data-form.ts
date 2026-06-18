import { yupResolver } from "@hookform/resolvers/yup";
import type { Resolver } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object({
  name: yup.string().trim().required("Campo obrigatório"),
  description: yup.string().optional(),
  imageUrl: yup.string().url("Url inválida").required("Campo obrigatório"),
  price: yup.number().required("Campo obrigatório").min(100, "Preço inválido"),
  compareAtPrice: yup
    .number()
    .required("Campo obrigatório")
    .test({
      message: "Deve ser maior que o preço",
      test: (value, context) => {
        const price: number = context.parent.price;

        if (!value || !price) return true;

        return value > price;
      },
    }),
  categoryId: yup.string().required("Campo obrigatório"),
});

export type Form = yup.InferType<typeof schema>;

export const defaultValues: Form = {
  name: "",
  imageUrl: "",
  categoryId: "",
  price: 0,
  compareAtPrice: 0,
};

export const resolver = yupResolver(schema) as Resolver<Form>;
