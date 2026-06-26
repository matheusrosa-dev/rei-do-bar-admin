import { api } from "../api";
import type {
  DecrementInventory,
  GetInventoryMovements,
  GetInventoryMovementsResponse,
  IncrementInventory,
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

  return {
    getInventoryMovements: {
      fn: getInventoryMovements,
      key: "get-inventory-movements",
    },
    incrementInventory,
    decrementInventory,
  };
};
