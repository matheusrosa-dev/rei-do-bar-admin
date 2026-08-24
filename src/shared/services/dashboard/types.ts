export type DeliveryPersonPerformance = {
  name: string;
  deliveredOrdersCount: number;
  cancelledOrdersCount: number;
};

export type DeliveryPersonsPerformanceTotals = {
  totalOrdersCount: number;
  deliveredOrdersCount: number;
  cancelledOrdersCount: number;
};

export type GetDeliveryPersonsPerformanceResponse = {
  totals: DeliveryPersonsPerformanceTotals;
  deliveryPersons: DeliveryPersonPerformance[];
};

export type GetDeliveryPersonsPerformance =
  () => Promise<GetDeliveryPersonsPerformanceResponse>;

export type UseDashboardService = () => {
  getDeliveryPersonsPerformance: {
    fn: GetDeliveryPersonsPerformance;
    key: string;
  };
};
