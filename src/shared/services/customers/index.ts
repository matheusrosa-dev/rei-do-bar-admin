import type { ICustomer, ICustomerWithRelations } from "@shared/models";
import { api } from "../api";
import type {
  ActivateCustomer,
  DeactivateCustomer,
  GetCustomerById,
  GetCustomers,
  GetCustomersResponse,
  GetCustomersSimple,
  RemoveCustomer,
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

  const getCustomerById: GetCustomerById = async (customerId) => {
    const response = await api.get<ICustomerWithRelations>(
      `${baseUrl}/${customerId}`,
    );

    return response.data.data;
  };

  const getCustomersSimple: GetCustomersSimple = async () => {
    const response = await api.get<ICustomer[]>(`${baseUrl}?simple=true`);

    return response.data.data;
  };

  const activateCustomer: ActivateCustomer = async (customerId) => {
    const response = await api.patch<ICustomer>(
      `${baseUrl}/${customerId}/activate`,
    );

    return response.data.data;
  };

  const deactivateCustomer: DeactivateCustomer = async (customerId) => {
    const response = await api.patch<ICustomer>(
      `${baseUrl}/${customerId}/deactivate`,
    );

    return response.data.data;
  };

  const removeCustomer: RemoveCustomer = async (customerId) => {
    await api.delete(`${baseUrl}/${customerId}`);
  };

  return {
    getCustomers: {
      fn: getCustomers,
      key: "get-customers",
    },
    getCustomerById: {
      fn: getCustomerById,
      key: "get-customer-by-id",
    },
    getCustomersSimple: {
      fn: getCustomersSimple,
      key: "get-customers-simple",
    },
    activateCustomer,
    deactivateCustomer,
    removeCustomer,
  };
};
