import { api } from "../api";
import type {
  GetAccountsSeries,
  GetAccountsSeriesResponse,
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

  const getAccountsSeries: GetAccountsSeries = async (queries) => {
    const response = await api.get<GetAccountsSeriesResponse>(
      `${baseUrl}/accounts-series`,
      { params: queries },
    );

    return response.data.data;
  };

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
    getAccountsSeries: {
      fn: getAccountsSeries,
      key: "get-accounts-series",
    },
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
