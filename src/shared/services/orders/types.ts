import type { IPagination } from "@shared/interfaces";
import type { IOrderWithItems, OrderStatus } from "@shared/models";

export type GetOrdersManagementResponse = Record<
  OrderStatus,
  IOrderWithItems[]
>;

export type GetOrdersManagement = () => Promise<GetOrdersManagementResponse>;

export type GetOrdersResponse = IPagination<IOrderWithItems>;

export type GetOrders = (query?: {
  page?: number;
  limit?: number;
}) => Promise<GetOrdersResponse>;

export type UpdateOrderStatusResponse = Record<OrderStatus, IOrderWithItems[]>;

export type UpdateOrderStatus = (props: {
  orderId: string;
  body: {
    status: OrderStatus;
    statusReason?: string;
  };
}) => Promise<UpdateOrderStatusResponse>;

export type UseOrdersService = () => {
  getOrdersManagement: {
    fn: GetOrdersManagement;
    key: string;
  };
  getOrders: {
    fn: GetOrders;
    key: string;
  };
  updateOrderStatus: UpdateOrderStatus;
};
