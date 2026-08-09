import type { IPagination, SortDirection } from "@shared/interfaces";
import type { IDeliveryPerson } from "@shared/models";

export type GetDeliveryPersonsSortKey = "createdAt" | "ordersCount";

export type GetDeliveryPersonsResponse = IPagination<IDeliveryPerson>;

export type GetDeliveryPersons = (query?: {
  page?: number;
  limit?: number;
  isActive?: boolean;
  searchTerm?: string;
  sortKey?: GetDeliveryPersonsSortKey;
  sortDirection?: SortDirection;
}) => Promise<GetDeliveryPersonsResponse>;

export type GetDeliveryPersonById = (
  deliveryPersonId: string,
) => Promise<IDeliveryPerson>;

export type CreateDeliveryPersonBody = {
  name: string;
  phone: string;
  cpf: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    zipCode: string;
  };
};

export type CreateDeliveryPerson = (
  body: CreateDeliveryPersonBody,
) => Promise<IDeliveryPerson>;

export type UpdateDeliveryPersonBody = CreateDeliveryPersonBody;

export type UpdateDeliveryPerson = (
  deliveryPersonId: string,
  body: UpdateDeliveryPersonBody,
) => Promise<IDeliveryPerson>;

export type ActivateDeliveryPerson = (
  deliveryPersonId: string,
) => Promise<IDeliveryPerson>;

export type DeactivateDeliveryPerson = (
  deliveryPersonId: string,
) => Promise<IDeliveryPerson>;

export type RemoveDeliveryPerson = (deliveryPersonId: string) => Promise<void>;

export type UseDeliveryPersonsService = () => {
  getDeliveryPersons: {
    fn: GetDeliveryPersons;
    key: string;
  };
  getDeliveryPersonById: {
    fn: GetDeliveryPersonById;
    key: string;
  };
  createDeliveryPerson: CreateDeliveryPerson;
  updateDeliveryPerson: UpdateDeliveryPerson;
  activateDeliveryPerson: ActivateDeliveryPerson;
  deactivateDeliveryPerson: DeactivateDeliveryPerson;
  removeDeliveryPerson: RemoveDeliveryPerson;
};
