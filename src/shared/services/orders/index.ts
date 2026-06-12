import { api } from "../api";
import type {
  GetOrdersManagement,
  GetOrdersManagementResponse,
  UseOrdersService,
} from "./types";

export const useOrdersService: UseOrdersService = () => {
  const baseUrl = "/orders";

  const getOrdersManagement: GetOrdersManagement = async () => {
    const response = await api.get<GetOrdersManagementResponse>(
      `${baseUrl}/management`,
    );

    return response.data.data;
  };

  return {
    getOrdersManagement: {
      fn: getOrdersManagement,
      key: "get-orders-management",
    },
  };
};
