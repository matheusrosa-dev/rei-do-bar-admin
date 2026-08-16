import type { IPagination, SortDirection } from "@shared/interfaces";
import type {
  IDeliveryPerson,
  IDeliveryPersonWithSession,
} from "@shared/models";

export type GetDeliveryPersonsSortKey = "createdAt" | "ordersCount";

export type GetDeliveryPersonsResponse =
  IPagination<IDeliveryPersonWithSession>;

export type GetDeliveryPersons = (query?: {
  page?: number;
  limit?: number;
  isActive?: boolean;
  searchTerm?: string;
  sortKey?: GetDeliveryPersonsSortKey;
  sortDirection?: SortDirection;
}) => Promise<GetDeliveryPersonsResponse>;

export type GetDeliveryPersonsSimpleResponse = Omit<
  IDeliveryPerson,
  "ordersCount"
>[];

export type GetDeliveryPersonsSimple =
  () => Promise<GetDeliveryPersonsSimpleResponse>;

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

export type UpdateDeliveryPersonPasswordBody = {
  password: string;
};

export type UpdateDeliveryPersonPasswordResponse = Omit<
  IDeliveryPerson,
  "ordersCount"
>;

export type UpdateDeliveryPersonPassword = (
  deliveryPersonId: string,
  body: UpdateDeliveryPersonPasswordBody,
) => Promise<UpdateDeliveryPersonPasswordResponse>;

export type RevokeDeliveryPersonAccess = (
  deliveryPersonId: string,
) => Promise<void>;

export type RevokeAllDeliveryPersonsAccess = () => Promise<void>;

export type RemoveDeliveryPerson = (deliveryPersonId: string) => Promise<void>;

export type UseDeliveryPersonsService = () => {
  getDeliveryPersons: {
    fn: GetDeliveryPersons;
    key: string;
  };
  getDeliveryPersonsSimple: {
    fn: GetDeliveryPersonsSimple;
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
  updateDeliveryPersonPassword: UpdateDeliveryPersonPassword;
  revokeDeliveryPersonAccess: RevokeDeliveryPersonAccess;
  revokeAllDeliveryPersonsAccess: RevokeAllDeliveryPersonsAccess;
  removeDeliveryPerson: RemoveDeliveryPerson;
};
