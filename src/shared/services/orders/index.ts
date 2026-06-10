import { api } from "../api";
import type { GetOrders, GetOrdersResponse, UseOrdersService } from "./types";

export const useOrdersService: UseOrdersService = () => {
  const baseUrl = "/orders";

  const getOrders: GetOrders = async (queries) => {
    const response = await api.get<GetOrdersResponse>(baseUrl, {
      params: queries,
    });

    return response.data.data;
  };

  return {
    getOrders: {
      fn: getOrders,
      key: "get-orders",
    },
  };
};
