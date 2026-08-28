import { api } from "../api";
import type {
  GetDeliveryPersonsPerformance,
  GetDeliveryPersonsPerformanceResponse,
  GetRevenue,
  GetRevenueResponse,
  UseDashboardService,
} from "./types";

export const useDashboardService: UseDashboardService = () => {
  const baseUrl = "/dashboard";

  const getDeliveryPersonsPerformance: GetDeliveryPersonsPerformance = async (
    queries,
  ) => {
    const response = await api.get<GetDeliveryPersonsPerformanceResponse>(
      `${baseUrl}/delivery-persons`,
      { params: queries },
    );

    return response.data.data;
  };

  const getRevenue: GetRevenue = async (queries) => {
    const response = await api.get<GetRevenueResponse>(`${baseUrl}/revenue`, {
      params: queries,
    });

    return response.data.data;
  };

  return {
    getDeliveryPersonsPerformance: {
      fn: getDeliveryPersonsPerformance,
      key: "get-delivery-persons-performance",
    },
    getRevenue: {
      fn: getRevenue,
      key: "get-revenue",
    },
  };
};
