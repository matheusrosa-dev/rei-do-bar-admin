import type { ICustomerWithAddresses } from "@shared/models";
import { api } from "../api";
import type {
  ActivateCustomer,
  DeactivateCustomer,
  GetCustomers,
  GetCustomersResponse,
  UseCustomersService,
} from "./types";

export const useCustomersService: UseCustomersService = () => {
  const baseUrl = "/customers";

  const getCustomers: GetCustomers = async (query) => {
    const response = await api.get<GetCustomersResponse>(baseUrl, {
      params: query,
    });

    return response.data.data;
  };

  const activateCustomer: ActivateCustomer = async (customerId) => {
    const response = await api.patch<ICustomerWithAddresses>(
      `${baseUrl}/${customerId}/activate`,
    );

    return response.data.data;
  };

  const deactivateCustomer: DeactivateCustomer = async (customerId) => {
    const response = await api.patch<ICustomerWithAddresses>(
      `${baseUrl}/${customerId}/deactivate`,
    );

    return response.data.data;
  };

  return {
    getCustomers: {
      fn: getCustomers,
      key: "get-customers",
    },
    activateCustomer,
    deactivateCustomer,
  };
};
