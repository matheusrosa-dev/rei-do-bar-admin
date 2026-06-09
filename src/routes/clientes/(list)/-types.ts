import type { IAddress, ICustomer } from "@shared/models";

export type CustomerWithMainAddressAndOrdersCount = ICustomer & {
  mainAddress: IAddress;
  allOrdersCount: number;
  cancelledOrdersCount: number;
  deliveredOrdersCount: number;
};
