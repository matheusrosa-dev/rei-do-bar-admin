import { api } from "../api";
import type {
  GetDeliveryPersonsPerformance,
  GetDeliveryPersonsPerformanceResponse,
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

  return {
    getDeliveryPersonsPerformance: {
      fn: getDeliveryPersonsPerformance,
      key: "get-delivery-persons-performance",
    },
  };
};
