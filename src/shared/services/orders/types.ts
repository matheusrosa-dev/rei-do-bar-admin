import type { IOrderWithItems, OrderStatus } from "@shared/models";

export type GetOrdersManagementResponse = Record<
  OrderStatus,
  IOrderWithItems[]
>;

export type GetOrdersManagement = () => Promise<GetOrdersManagementResponse>;

export type UseOrdersService = () => {
  getOrdersManagement: {
    fn: GetOrdersManagement;
    key: string;
  };
};
