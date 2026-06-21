import { NotificationAction, NotificationTarget } from "@shared/models";

export const NOTIFICATION_TARGETS = Object.values(NotificationTarget);
export const NOTIFICATION_ACTIONS = Object.values(NotificationAction);

export const NOTIFICATION_TARGET_LABEL: Record<NotificationTarget, string> = {
  ALL: "Todos os clientes",
};

export const NOTIFICATION_ACTION_LABEL: Record<NotificationAction, string> = {
  REDIRECT_TO_ORDERS: "Redirecionar para pedidos",
};
