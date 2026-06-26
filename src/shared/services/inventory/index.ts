import { api } from "../api";
import type {
  GetInventoryMovements,
  GetInventoryMovementsResponse,
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

  return {
    getInventoryMovements: {
      fn: getInventoryMovements,
      key: "get-inventory-movements",
    },
  };
};
