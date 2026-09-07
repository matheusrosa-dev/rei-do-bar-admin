import { yupResolver } from "@hookform/resolvers/yup";
import type { Resolver } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object({
  name: yup.string().trim().required("Campo obrigatório"),
  pluralName: yup.string().trim().required("Campo obrigatório"),
  imageUrl: yup.string().url("Url inválida").required("Campo obrigatório"),
});

export type Form = yup.InferType<typeof schema>;

export const defaultValues: Form = {
  name: "",
  pluralName: "",
  imageUrl: "",
};

export const resolver = yupResolver(schema) as Resolver<Form>;
