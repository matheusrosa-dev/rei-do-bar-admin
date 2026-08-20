import { yupResolver } from "@hookform/resolvers/yup";
import { NotificationAction, NotificationTarget } from "@shared/models";
import type { Resolver } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object({
  title: yup.string().trim().required("Campo obrigatório"),
  description: yup.string().trim().required("Campo obrigatório"),
  target: yup
    .string()
    .oneOf(Object.values(NotificationTarget))
    .required("Campo obrigatório"),
  action: yup
    .string()
    .oneOf([NotificationAction.REDIRECT_TO_ORDERS])
    .optional()
    .nullable(),
});

export type Form = yup.InferType<typeof schema>;

export const defaultValues: Form = {
  title: "",
  description: "",
  target: NotificationTarget.ALL,
};

export const resolver = yupResolver(schema) as Resolver<Form>;
