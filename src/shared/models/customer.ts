import type { IOrderWithItems } from "./order";

export interface ICustomer {
  id: string;
  name: string | null;
  phone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddress {
  id: string;
  customerId: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  zipCode: string;
  isMain: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICustomerWithRelations extends ICustomer {
  addresses: IAddress[];
  orders: IOrderWithItems[];
}
