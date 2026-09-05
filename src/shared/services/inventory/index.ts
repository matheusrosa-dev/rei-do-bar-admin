import { api } from "../api";
import type {
  DecrementInventory,
  GetInventoryMovements,
  GetInventoryMovementsResponse,
  IncrementInventory,
  RevertInventoryMovement,
  UpdateInventoryMovement,
  UseInventoryService,
} from "./types";

export const useInventoryService: UseInventoryService = () => {
  const baseUrl = "/inventory";

  const getInventoryMovements: GetInventoryMovements = async (queries) => {
    const response = await api.get<GetInventoryMovementsResponse>(
      `${baseUrl}/movements`,
      { params: queries },
    );

    return response.data.data;
  };

  const incrementInventory: IncrementInventory = async (body) => {
    await api.post(`${baseUrl}/increment`, body);
  };

  const decrementInventory: DecrementInventory = async (body) => {
    await api.post(`${baseUrl}/decrement`, body);
  };

  const updateInventoryMovement: UpdateInventoryMovement = async (
    movementId,
    body,
  ) => {
    await api.put(`${baseUrl}/movements/${movementId}`, body);
  };

  const revertInventoryMovement: RevertInventoryMovement = async (
    movementId,
  ) => {
    await api.delete(`${baseUrl}/movements/${movementId}`);
  };

  return {
    getInventoryMovements: {
      fn: getInventoryMovements,
      key: "get-inventory-movements",
    },
    incrementInventory,
    decrementInventory,
    updateInventoryMovement,
    revertInventoryMovement,
  };
};
