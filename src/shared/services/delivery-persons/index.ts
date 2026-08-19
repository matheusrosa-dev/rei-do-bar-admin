import type { IDeliveryPerson } from "@shared/models";
import { api } from "../api";
import type {
  ActivateDeliveryPerson,
  CreateDeliveryPerson,
  DeactivateDeliveryPerson,
  GetDeliveryPersonById,
  GetDeliveryPersons,
  GetDeliveryPersonsHasAccess,
  GetDeliveryPersonsHasAccessResponse,
  GetDeliveryPersonsResponse,
  GetDeliveryPersonsSimple,
  GetDeliveryPersonsSimpleResponse,
  RemoveDeliveryPerson,
  RevokeAllDeliveryPersonsAccess,
  RevokeDeliveryPersonAccess,
  UpdateDeliveryPerson,
  UpdateDeliveryPersonPassword,
  UpdateDeliveryPersonPasswordResponse,
  UseDeliveryPersonsService,
} from "./types";

export const useDeliveryPersonsService: UseDeliveryPersonsService = () => {
  const baseUrl = "/delivery-persons";

  const getDeliveryPersons: GetDeliveryPersons = async (query) => {
    const response = await api.get<GetDeliveryPersonsResponse>(baseUrl, {
      params: query,
    });

    return response.data.data;
  };

  const getDeliveryPersonsSimple: GetDeliveryPersonsSimple = async () => {
    const response = await api.get<GetDeliveryPersonsSimpleResponse>(
      `${baseUrl}?simple=true`,
    );

    return response.data.data;
  };

  const getDeliveryPersonsHasAccess: GetDeliveryPersonsHasAccess = async () => {
    const response = await api.get<GetDeliveryPersonsHasAccessResponse>(
      `${baseUrl}/has-access`,
    );

    return response.data.data;
  };

  const getDeliveryPersonById: GetDeliveryPersonById = async (
    deliveryPersonId,
  ) => {
    const response = await api.get<IDeliveryPerson>(
      `${baseUrl}/${deliveryPersonId}`,
    );

    return response.data.data;
  };

  const createDeliveryPerson: CreateDeliveryPerson = async (body) => {
    const response = await api.post<IDeliveryPerson>(baseUrl, body);

    return response.data.data;
  };

  const updateDeliveryPerson: UpdateDeliveryPerson = async (
    deliveryPersonId,
    body,
  ) => {
    const response = await api.put<IDeliveryPerson>(
      `${baseUrl}/${deliveryPersonId}`,
      body,
    );

    return response.data.data;
  };

  const activateDeliveryPerson: ActivateDeliveryPerson = async (
    deliveryPersonId,
  ) => {
    const response = await api.patch<IDeliveryPerson>(
      `${baseUrl}/${deliveryPersonId}/activate`,
    );

    return response.data.data;
  };

  const deactivateDeliveryPerson: DeactivateDeliveryPerson = async (
    deliveryPersonId,
  ) => {
    const response = await api.patch<IDeliveryPerson>(
      `${baseUrl}/${deliveryPersonId}/deactivate`,
    );

    return response.data.data;
  };

  const updateDeliveryPersonPassword: UpdateDeliveryPersonPassword = async (
    deliveryPersonId,
    body,
  ) => {
    const response = await api.put<UpdateDeliveryPersonPasswordResponse>(
      `${baseUrl}/${deliveryPersonId}/password`,
      body,
    );

    return response.data.data;
  };

  const revokeDeliveryPersonAccess: RevokeDeliveryPersonAccess = async (
    deliveryPersonId,
  ) => {
    await api.post(`${baseUrl}/${deliveryPersonId}/revoke-access`);
  };

  const revokeAllDeliveryPersonsAccess: RevokeAllDeliveryPersonsAccess =
    async () => {
      await api.post(`${baseUrl}/revoke-access`);
    };

  const removeDeliveryPerson: RemoveDeliveryPerson = async (
    deliveryPersonId,
  ) => {
    await api.delete(`${baseUrl}/${deliveryPersonId}`);
  };

  return {
    getDeliveryPersons: {
      fn: getDeliveryPersons,
      key: "get-delivery-persons",
    },
    getDeliveryPersonsSimple: {
      fn: getDeliveryPersonsSimple,
      key: "get-delivery-persons-simple",
    },
    getDeliveryPersonsHasAccess: {
      fn: getDeliveryPersonsHasAccess,
      key: "get-delivery-persons-has-access",
    },
    getDeliveryPersonById: {
      fn: getDeliveryPersonById,
      key: "get-delivery-person-by-id",
    },
    createDeliveryPerson,
    updateDeliveryPerson,
    activateDeliveryPerson,
    deactivateDeliveryPerson,
    updateDeliveryPersonPassword,
    revokeDeliveryPersonAccess,
    revokeAllDeliveryPersonsAccess,
    removeDeliveryPerson,
  };
};
