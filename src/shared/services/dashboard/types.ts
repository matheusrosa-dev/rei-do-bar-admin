export type DeliveryPersonPerformance = {
  name: string;
  deliveredOrdersCount: number;
  cancelledOrdersCount: number;
};

export type DeliveryPersonsPerformanceTotals = {
  totalOrdersCount: number;
  deliveredOrdersCount: number;
  cancelledOrdersCount: number;
  averageDeliveryMinutes: number | null;
  averageCancellationAfterShippingMinutes: number | null;
};

export type GetDeliveryPersonsPerformanceResponse = {
  totals: DeliveryPersonsPerformanceTotals;
  deliveryPersons: DeliveryPersonPerformance[];
};

export type GetDeliveryPersonsPerformance = (queries?: {
  startDate?: Date;
  endDate?: Date;
}) => Promise<GetDeliveryPersonsPerformanceResponse>;

export interface RevenueTotals {
  deliveredOrdersCount: number;
  revenue: number;
  couponDiscount: number;
  couponDiscountPercentage: number | null;
}

export interface RevenuePoint extends RevenueTotals {
  label: string;
}

export interface GetRevenueResponse {
  totals: RevenueTotals;
  series: RevenuePoint[];
}

export type GetRevenue = (queries?: {
  startDate?: Date;
  endDate?: Date;
}) => Promise<GetRevenueResponse>;

export type UseDashboardService = () => {
  getDeliveryPersonsPerformance: {
    fn: GetDeliveryPersonsPerformance;
    key: string;
  };
  getRevenue: {
    fn: GetRevenue;
    key: string;
  };
};
