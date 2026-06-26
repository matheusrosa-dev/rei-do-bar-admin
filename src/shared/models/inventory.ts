import type { IOrder } from "./order";
import type { IProduct } from "./product";

export enum InventoryMovementOrigin {
  ORDER_CREATION = "ORDER_CREATION",
  ORDER_CANCELLATION = "ORDER_CANCELLATION",
  ADMIN_ORDER_CANCELLATION = "ADMIN_ORDER_CANCELLATION",
  ADMIN_RESTOCK = "ADMIN_RESTOCK",
  ADMIN_REMOVAL = "ADMIN_REMOVAL",
}

export interface IInventoryMovement {
  id: string;
  origin: InventoryMovementOrigin;
  orderId: string;
  createdAt: string;
  order: IOrder;
  products: Array<{
    id: string;
    inventoryMovementId: string;
    productId: string;
    quantity: number;
    price: number;
    createdAt: string;
    product: IProduct;
  }>;
}
