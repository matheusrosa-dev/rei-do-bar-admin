import { api } from "../api";
import type {
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

  return {
    getCustomers: {
      fn: getCustomers,
      key: "get-customers",
    },
  };
};
