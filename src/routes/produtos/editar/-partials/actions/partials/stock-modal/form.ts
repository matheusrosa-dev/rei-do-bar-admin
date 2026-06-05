import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  amount: yup
    .number()
    .transform((val) => (Number.isNaN(val) ? undefined : val))
    .required("Campo obrigatório")
    .min(1, "Deve ser maior que 0"),
});

export type Form = yup.InferType<typeof schema>;

export const defaultValues = {} as Form;

export const resolver = yupResolver(schema);
