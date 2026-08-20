import { api } from "../api";
import type {
  GetNotifications,
  GetNotificationsResponse,
  PushNotification,
  UseNotificationsService,
} from "./types";

export const useNotificationsService: UseNotificationsService = () => {
  const baseUrl = "/notifications";

  const getNotifications: GetNotifications = async (queries) => {
    const response = await api.get<GetNotificationsResponse>(baseUrl, {
      params: queries,
    });

    return response.data.data;
  };

  const pushNotification: PushNotification = async (body) => {
    await api.post(baseUrl, body);
  };

  return {
    getNotifications: {
      fn: getNotifications,
      key: "get-notifications",
    },
    pushNotification,
  };
};
