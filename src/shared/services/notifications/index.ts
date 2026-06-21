import { api } from "../api";
import type { PushNotification, UseNotificationsService } from "./types";

export const useNotificationsService: UseNotificationsService = () => {
  const baseUrl = "/notifications";

  const pushNotification: PushNotification = async (body) => {
    await api.post(baseUrl, body);
  };

  return {
    pushNotification,
  };
};
