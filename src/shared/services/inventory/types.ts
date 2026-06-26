import type { IPagination } from "@shared/interfaces";
import type { IInventoryMovement } from "@shared/models";

export type GetInventoryMovementsResponse = IPagination<IInventoryMovement>;

export type GetInventoryMovements = (queries?: {
  page?: number;
  limit?: number;
}) => Promise<GetInventoryMovementsResponse>;

export type UseInventoryService = () => {
  getInventoryMovements: {
    fn: GetInventoryMovements;
    key: string;
  };
};
