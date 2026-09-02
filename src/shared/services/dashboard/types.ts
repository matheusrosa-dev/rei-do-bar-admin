export type DeliveryPersonPerformance = {
  name: string;
  deliveredOrdersCount: number;
  cancelledOrdersCount: number;
  deliveryFeeTotal: number;
};

export type GetDeliveryPersonsPerformanceResponse = {
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
  firstDeliveredOrdersCount: number;
  redeemedCouponOrdersCount: number;
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

export interface AccountsSeriesPoint {
  label: string;
  newAnonymousCustomersCount: number;
  newCustomersCount: number;
}

export interface GetAccountsSeriesResponse {
  series: AccountsSeriesPoint[];
}

export type GetAccountsSeries = (queries?: {
  startDate?: Date;
  endDate?: Date;
}) => Promise<GetAccountsSeriesResponse>;

export interface GetSummaryResponse {
  deliveredOrdersCount: number;
  firstDeliveredOrdersCount: number;
  newCustomersCount: number;
  failedDeliveriesCount: number;
  averageDeliveryMinutes: number | null;
  averageOrderValue: number;
  highestOrderValue: number;
  redeemedCouponOrdersCount: number;
  revenue: number;
  deliveryFeeTotal: number;
  restockCost: number;
  profit: number;
  profitPercentage: number;
  couponDiscount: number;
  couponDiscountPercentage: number;
}

export type GetSummary = (queries?: {
  startDate?: Date;
  endDate?: Date;
}) => Promise<GetSummaryResponse>;

export type UseDashboardService = () => {
  getAccountsSeries: {
    fn: GetAccountsSeries;
    key: string;
  };
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
