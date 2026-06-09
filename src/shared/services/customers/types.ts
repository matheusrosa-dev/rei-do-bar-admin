import type { IPagination, SortDirection } from "@shared/interfaces";
import type {
  IAddress,
  ICustomer,
  ICustomerWithRelations,
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

export type GetCustomerById = (
  customerId: string,
) => Promise<ICustomerWithRelations>;

export type ActivateCustomer = (customerId: string) => Promise<ICustomer>;

export type DeactivateCustomer = (customerId: string) => Promise<ICustomer>;

export type RemoveCustomer = (customerId: string) => Promise<void>;

export type UseCustomersService = () => {
  getCustomers: {
    fn: GetCustomers;
    key: string;
  };
  getCustomerById: {
    fn: GetCustomerById;
    key: string;
  };
  activateCustomer: ActivateCustomer;
  deactivateCustomer: DeactivateCustomer;
  removeCustomer: RemoveCustomer;
};
