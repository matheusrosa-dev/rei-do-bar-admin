import type { IPagination } from "@shared/interfaces";
import type { IAddress, ICustomer } from "@shared/models";

export type GetCustomersResponse = IPagination<
  ICustomer & {
    mainAddress: IAddress;
    allOrdersCount: number;
    cancelledOrdersCount: number;
    deliveredOrdersCount: number;
  }
>;

export type GetCustomers = (query?: {
  isActive?: boolean;
  page?: number;
  limit?: number;
}) => Promise<GetCustomersResponse>;

export type UseCustomersService = () => {
  getCustomers: {
    fn: GetCustomers;
    key: string;
  };
};
