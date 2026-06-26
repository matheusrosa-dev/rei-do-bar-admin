import { yupResolver } from "@hookform/resolvers/yup";
import { InventoryMovementOrigin } from "@shared/models";
import type { Resolver } from "react-hook-form";
import * as yup from "yup";

const productSchema = yup.object({
  productId: yup.string().required(),
  name: yup.string().required(),
  imageUrl: yup.string().defined(),
  stockQuantity: yup.number().required(),
  isActive: yup.boolean().required(),
  selected: yup.boolean().required(),
  quantity: yup
    .number()
    .transform((value) => (Number.isNaN(value) ? undefined : value))
    .when("selected", ([selected], field) =>
      selected
        ? field
            .integer("Quantidade inválida")
            .min(1, "Mínimo 1")
            .required("Informe a quantidade")
        : field.notRequired(),
    ),
  cost: yup
    .number()
    .when(["selected", "$origin"], ([selected, origin], field) =>
      selected && origin === InventoryMovementOrigin.ADMIN_RESTOCK
        ? field.min(1, "Informe o preço").required("Informe o preço")
        : field.notRequired(),
    ),
});

const schema = yup.object({
  origin: yup
    .string()
    .oneOf([
      InventoryMovementOrigin.ADMIN_RESTOCK,
      InventoryMovementOrigin.ADMIN_REMOVAL,
    ])
    .required("Campo obrigatório"),
  products: yup
    .array(productSchema)
    .required()
    .test("at-least-one", "Selecione ao menos um produto", (products) =>
      (products ?? []).some((product) => product.selected),
    ),
});

export type Form = yup.InferType<typeof schema>;

export const defaultValues: Form = {
  origin: InventoryMovementOrigin.ADMIN_RESTOCK,
  products: [],
};

export const resolver = yupResolver(schema) as Resolver<Form>;
