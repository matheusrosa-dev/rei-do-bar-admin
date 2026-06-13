import { api } from "../api";
import type {
  GetOrders,
  GetOrdersManagement,
  GetOrdersManagementResponse,
  GetOrdersResponse,
  UpdateOrderStatus,
  UpdateOrderStatusResponse,
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

  const getOrders: GetOrders = async (query) => {
    const response = await api.get<GetOrdersResponse>(baseUrl, {
      params: query,
    });

    return response.data.data;
  };

  const updateOrderStatus: UpdateOrderStatus = async ({ orderId, body }) => {
    const response = await api.patch<UpdateOrderStatusResponse>(
      `${baseUrl}/${orderId}/status`,
      body,
    );

    return response.data.data;
  };

  return {
    getOrdersManagement: {
      fn: getOrdersManagement,
      key: "get-orders-management",
    },
    getOrders: {
      fn: getOrders,
      key: "get-orders",
    },
    updateOrderStatus,
  };
};
