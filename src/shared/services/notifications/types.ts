import type { NotificationAction, NotificationTarget } from "@shared/models";

export type PushNotification = (body: {
  title: string;
  description: string;
  target: NotificationTarget;
  action?: NotificationAction;
}) => Promise<void>;

export type UseNotificationsService = () => {
  pushNotification: PushNotification;
};
