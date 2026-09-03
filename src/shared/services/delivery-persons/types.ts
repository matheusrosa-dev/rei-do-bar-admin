import type { IPagination } from "@shared/interfaces";
import type {
  IDeliveryPerson,
  IDeliveryPersonWithAccess,
} from "@shared/models";

export type GetDeliveryPersonsResponse = IPagination<IDeliveryPersonWithAccess>;

export type GetDeliveryPersons = (query?: {
  page?: number;
  limit?: number;
  isActive?: boolean;
  searchTerm?: string;
}) => Promise<GetDeliveryPersonsResponse>;

export type GetDeliveryPersonsSimpleResponse = Omit<
  IDeliveryPerson,
  "ordersCount"
>[];

export type GetDeliveryPersonsSimple =
  () => Promise<GetDeliveryPersonsSimpleResponse>;

export interface GetDeliveryPersonsHasAccessResponse {
  hasAccess: boolean;
}

export type GetDeliveryPersonsHasAccess =
  () => Promise<GetDeliveryPersonsHasAccessResponse>;

export type GetDeliveryPersonById = (
  deliveryPersonId: string,
) => Promise<IDeliveryPerson>;

export type CreateDeliveryPersonBody = Pick<
  IDeliveryPerson,
  "name" | "phone" | "cpf"
>;

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

export type MarkDeliveryPersonAsVolunteer = (
  deliveryPersonId: string,
) => Promise<IDeliveryPerson>;

export type UnmarkDeliveryPersonAsVolunteer = (
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
  getDeliveryPersonsHasAccess: {
    fn: GetDeliveryPersonsHasAccess;
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
  markDeliveryPersonAsVolunteer: MarkDeliveryPersonAsVolunteer;
  unmarkDeliveryPersonAsVolunteer: UnmarkDeliveryPersonAsVolunteer;
  updateDeliveryPersonPassword: UpdateDeliveryPersonPassword;
  revokeDeliveryPersonAccess: RevokeDeliveryPersonAccess;
  revokeAllDeliveryPersonsAccess: RevokeAllDeliveryPersonsAccess;
  removeDeliveryPerson: RemoveDeliveryPerson;
};
