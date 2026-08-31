export type DeliveryPersonPerformance = {
  name: string;
  deliveredOrdersCount: number;
  cancelledOrdersCount: number;
};

export type DeliveryPersonsPerformanceTotals = {
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

export interface SeriesPoint {
  label: string;
  deliveredOrdersCount: number;
  averageOrderValue: number;
  revenue: number;
  couponDiscount: number;
  couponDiscountPercentage: number;
}

export interface GetSeriesResponse {
  series: SeriesPoint[];
}

export type GetSeries = (queries?: {
  startDate?: Date;
  endDate?: Date;
}) => Promise<GetSeriesResponse>;

export interface GetSummaryResponse {
  deliveredOrdersCount: number;
  firstDeliveredOrdersCount: number;
  newCustomersCount: number;
  cancelledOrdersCount: number;
  averageOrderValue: number;
  highestOrderValue: number;
  redeemedCouponOrdersCount: number;
  revenue: number;
  couponDiscount: number;
  couponDiscountPercentage: number;
}

export type GetSummary = (queries?: {
  startDate?: Date;
  endDate?: Date;
}) => Promise<GetSummaryResponse>;

export type UseDashboardService = () => {
  getDeliveryPersonsPerformance: {
    fn: GetDeliveryPersonsPerformance;
    key: string;
  };
  getSeries: {
    fn: GetSeries;
    key: string;
  };
  getSummary: {
    fn: GetSummary;
    key: string;
  };
};
