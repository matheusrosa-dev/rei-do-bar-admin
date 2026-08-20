import type { IPagination } from "@shared/interfaces";
import type {
  INotification,
  NotificationAction,
  NotificationStatus,
  NotificationTarget,
} from "@shared/models";

export type GetNotificationsResponse = IPagination<INotification>;

export type GetNotifications = (queries?: {
  page?: number;
  limit?: number;
  target?: NotificationTarget[];
  status?: NotificationStatus[];
}) => Promise<GetNotificationsResponse>;

export type PushNotification = (body: {
  title: string;
  description: string;
  target: NotificationTarget;
  action?: NotificationAction;
}) => Promise<void>;

export type UseNotificationsService = () => {
  getNotifications: {
    fn: GetNotifications;
    key: string;
  };
  pushNotification: PushNotification;
};
