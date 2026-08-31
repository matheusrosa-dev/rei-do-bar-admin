import { api } from "../api";
import type {
  GetDeliveryPersonsPerformance,
  GetDeliveryPersonsPerformanceResponse,
  GetSeries,
  GetSeriesResponse,
  GetSummary,
  GetSummaryResponse,
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

  const getSeries: GetSeries = async (queries) => {
    const response = await api.get<GetSeriesResponse>(`${baseUrl}/series`, {
      params: queries,
    });

    return response.data.data;
  };

  const getSummary: GetSummary = async (queries) => {
    const response = await api.get<GetSummaryResponse>(`${baseUrl}/summary`, {
      params: queries,
    });

    return response.data.data;
  };

  return {
    getDeliveryPersonsPerformance: {
      fn: getDeliveryPersonsPerformance,
      key: "get-delivery-persons-performance",
    },
    getSeries: {
      fn: getSeries,
      key: "get-series",
    },
    getSummary: {
      fn: getSummary,
      key: "get-summary",
    },
  };
};
