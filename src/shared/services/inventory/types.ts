import type { IPagination } from "@shared/interfaces";
import type {
  IInventoryMovement,
  IInventoryMovementProduct,
  InventoryMovementOrigin,
} from "@shared/models";

export type GetInventoryMovementsResponse = IPagination<IInventoryMovement>;

export type GetInventoryMovements = (queries?: {
  page?: number;
  limit?: number;
  origin?: InventoryMovementOrigin[];
  productIds?: string[];
}) => Promise<GetInventoryMovementsResponse>;

export type MovementProductsBody = {
  movementProducts: Array<
    Pick<IInventoryMovementProduct, "productId" | "quantity"> & {
      totalCost: number;
    }
  >;
};

export type IncrementInventory = (body: MovementProductsBody) => Promise<void>;

export type UpdateInventoryMovement = (
  movementId: string,
  body: MovementProductsBody,
) => Promise<void>;

export type RevertInventoryMovement = (movementId: string) => Promise<void>;

export type DecrementInventory = (body: {
  movementProducts: Pick<IInventoryMovementProduct, "productId" | "quantity">[];
}) => Promise<void>;

export type UseInventoryService = () => {
  getInventoryMovements: {
    fn: GetInventoryMovements;
    key: string;
  };
  incrementInventory: IncrementInventory;
  decrementInventory: DecrementInventory;
  updateInventoryMovement: UpdateInventoryMovement;
  revertInventoryMovement: RevertInventoryMovement;
};
