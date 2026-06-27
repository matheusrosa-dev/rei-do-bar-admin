import { InventoryMovementOrigin } from "@shared/models";

type MovementDirection = "active" | "inactive";

export const MOVEMENT_QUANTITY_CLASS: Record<MovementDirection, string> = {
  active: "text-green-400 font-medium",
  inactive: "text-red-400 font-medium",
};

export const MOVEMENT_PROPS_BY_ORIGIN: Record<
  InventoryMovementOrigin,
  {
    originVariant: MovementDirection;
    originTranslation: string;
    totalVariant: MovementDirection;
    quantityVariant: MovementDirection;
  }
> = {
  [InventoryMovementOrigin.ORDER_CREATION]: {
    originVariant: "active",
    originTranslation: "Criação de pedido",
    totalVariant: "active",
    quantityVariant: "inactive",
  },
  [InventoryMovementOrigin.ORDER_CANCELLATION]: {
    originVariant: "inactive",
    originTranslation: "Cancelamento de pedido",
    totalVariant: "inactive",
    quantityVariant: "active",
  },
  [InventoryMovementOrigin.ADMIN_ORDER_CANCELLATION]: {
    originVariant: "inactive",
    originTranslation: "Cancelamento de pedido",
    totalVariant: "inactive",
    quantityVariant: "active",
  },
  [InventoryMovementOrigin.ADMIN_RESTOCK]: {
    originTranslation: "Reposição de estoque",
    originVariant: "active",
    totalVariant: "inactive",
    quantityVariant: "active",
  },
  [InventoryMovementOrigin.ADMIN_REMOVAL]: {
    originVariant: "inactive",
    originTranslation: "Remoção de estoque",
    totalVariant: "inactive",
    quantityVariant: "inactive",
  },
};

export const ADMIN_ORIGINS = [
  InventoryMovementOrigin.ADMIN_ORDER_CANCELLATION,
  InventoryMovementOrigin.ADMIN_RESTOCK,
  InventoryMovementOrigin.ADMIN_REMOVAL,
];

export const ORIGIN_FILTER_OPTIONS = Object.values(InventoryMovementOrigin).map(
  (origin) => {
    const { originTranslation } = MOVEMENT_PROPS_BY_ORIGIN[origin];
    const label = ADMIN_ORIGINS.includes(origin)
      ? `${originTranslation} (Admin)`
      : originTranslation;

    return { value: origin, label };
  },
);
