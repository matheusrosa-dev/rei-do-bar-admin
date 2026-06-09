import type { IPagination, SortDirection } from "@shared/interfaces";
import type {
  IAddress,
  ICustomer,
  ICustomerWithAddresses,
} from "@shared/models";

export type GetCustomersSortKey = "allOrdersCount" | "deliveredOrdersCount";

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
  searchTerm?: string;
  sortKey?: GetCustomersSortKey;
  sortDirection?: SortDirection;
}) => Promise<GetCustomersResponse>;

export type ActivateCustomer = (
  customerId: string,
) => Promise<ICustomerWithAddresses>;

export type DeactivateCustomer = (
  customerId: string,
) => Promise<ICustomerWithAddresses>;

export type UseCustomersService = () => {
  getCustomers: {
    fn: GetCustomers;
    key: string;
  };
  activateCustomer: ActivateCustomer;
  deactivateCustomer: DeactivateCustomer;
};
