import { yupResolver } from "@hookform/resolvers/yup";
import { isValidCpf } from "@shared/helpers/cpf";
import type { IDeliveryPerson } from "@shared/models";
import type { Resolver } from "react-hook-form";
import * as yup from "yup";

const ONLY_DIGITS = /^\d+$/;

const schema = yup.object({
  name: yup
    .string()
    .trim()
    .min(1, "Campo obrigatório")
    .max(100, "Máximo 100 caracteres")
    .required("Campo obrigatório"),
  phone: yup
    .string()
    .matches(ONLY_DIGITS, "Apenas dígitos")
    .length(11, "Informe 11 dígitos")
    .required("Campo obrigatório"),
  cpf: yup
    .string()
    .matches(ONLY_DIGITS, "Apenas dígitos")
    .length(11, "Informe 11 dígitos")
    .test("cpf-check", "CPF inválido", (value) =>
      typeof value === "string" ? isValidCpf(value) : false,
    )
    .required("Campo obrigatório"),
});

export type Form = yup.InferType<typeof schema>;

export const defaultValues: Form = {
  name: "",
  phone: "",
  cpf: "",
};

export const resolver = yupResolver(schema) as Resolver<Form>;

export const deliveryPersonToForm = (
  deliveryPerson: IDeliveryPerson,
): Form => ({
  name: deliveryPerson.name,
  phone: deliveryPerson.phone,
  cpf: deliveryPerson.cpf,
});
