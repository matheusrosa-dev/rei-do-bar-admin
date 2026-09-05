import {
  InventoryMovementOrigin,
  type IInventoryMovement,
  type IInventoryMovementProduct,
  type IProduct,
} from "@shared/models";
import type { Form } from "../form";

type ProductFormRow = Form["products"][number];

const toProductRow = (
  product: IProduct,
  movementProduct?: IInventoryMovementProduct,
): ProductFormRow => ({
  productId: product.id,
  name: product.name,
  imageUrl: product.imageUrl,
  stockQuantity: product.stockQuantity,
  isActive: product.isActive,
  selected: !!movementProduct,
  previousQuantity: movementProduct?.quantity ?? 0,
  quantity: movementProduct?.quantity,
  totalCost: movementProduct
    ? movementProduct.price * movementProduct.quantity
    : 0,
});

const toProductRows = (
  products: IProduct[],
  movement?: IInventoryMovement,
): ProductFormRow[] => {
  const movementProducts = new Map(
    (movement?.products ?? []).map((item) => [item.productId, item]),
  );

  const outOfCatalog = (movement?.products ?? [])
    .filter(
      (item) => !products.some((product) => product.id === item.productId),
    )
    .map((item) => toProductRow(item.product, item));

  return [
    ...outOfCatalog,
    ...products.map((product) =>
      toProductRow(product, movementProducts.get(product.id)),
    ),
  ];
};

const toFormOrigin = (movement?: IInventoryMovement): Form["origin"] => {
  if (!movement) return "";

  if (movement.origin === InventoryMovementOrigin.ADMIN_REMOVAL) {
    return InventoryMovementOrigin.ADMIN_REMOVAL;
  }

  return InventoryMovementOrigin.ADMIN_RESTOCK;
};

export const toFormValues = (
  products: IProduct[],
  movement?: IInventoryMovement,
): Form => ({
  origin: toFormOrigin(movement),
  products: toProductRows(products, movement),
});
