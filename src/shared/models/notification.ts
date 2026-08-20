export enum NotificationTarget {
  ALL = "ALL",
  NO_ORDERS = "NO_ORDERS",
  ABANDONED_CART = "ABANDONED_CART",
  INACTIVE_30_DAYS = "INACTIVE_30_DAYS",
  SINGLE_ORDER = "SINGLE_ORDER",
}

export enum NotificationAction {
  REDIRECT_TO_ORDERS = "REDIRECT_TO_ORDERS",
}

export enum NotificationStatus {
  SENT = "SENT",
  FAILED = "FAILED",
}

export interface INotification {
  id: string;
  target: NotificationTarget;
  title: string;
  description: string;
  action: NotificationAction | null;
  status: NotificationStatus;
  customersCount: number;
  createdAt: string;
}
