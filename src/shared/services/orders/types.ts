import type { IPagination } from "@shared/interfaces";
import type { IOrder } from "@shared/models";

export type GetOrdersResponse = IPagination<IOrder>;

export type GetOrders = (queries?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
}) => Promise<GetOrdersResponse>;

export type UseOrdersService = () => {
  getOrders: {
    fn: GetOrders;
    key: string;
  };
};
