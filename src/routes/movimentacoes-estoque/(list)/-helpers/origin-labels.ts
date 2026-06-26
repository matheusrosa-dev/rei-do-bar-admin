import { InventoryMovementOrigin } from "@shared/models";

type MovementDirection = "active" | "inactive";

export const MOVEMENT_ORIGIN_LABEL: Record<InventoryMovementOrigin, string> = {
  [InventoryMovementOrigin.ORDER_CREATION]: "Criação de pedido",
  [InventoryMovementOrigin.ORDER_CANCELLATION]: "Cancelamento de pedido",
  [InventoryMovementOrigin.ADMIN_ORDER_CANCELLATION]:
    "Cancelamento de pedido (admin)",
  [InventoryMovementOrigin.ADMIN_RESTOCK]: "Reposição de estoque",
  [InventoryMovementOrigin.ADMIN_REMOVAL]: "Remoção de estoque",
};

export const MOVEMENT_ORIGIN_VARIANT: Record<
  InventoryMovementOrigin,
  MovementDirection
> = {
  [InventoryMovementOrigin.ORDER_CREATION]: "active",
  [InventoryMovementOrigin.ORDER_CANCELLATION]: "inactive",
  [InventoryMovementOrigin.ADMIN_ORDER_CANCELLATION]: "inactive",
  [InventoryMovementOrigin.ADMIN_RESTOCK]: "inactive",
  [InventoryMovementOrigin.ADMIN_REMOVAL]: "active",
};

export const MOVEMENT_QUANTITY_SIGN: Record<MovementDirection, string> = {
  active: "+",
  inactive: "-",
};

export const MOVEMENT_QUANTITY_CLASS: Record<MovementDirection, string> = {
  active: "text-green-400 font-medium",
  inactive: "text-red-400 font-medium",
};
