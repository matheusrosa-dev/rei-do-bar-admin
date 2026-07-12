import { NotificationAction, NotificationTarget } from "@shared/models";

export const NOTIFICATION_TARGETS = Object.values(NotificationTarget);
export const NOTIFICATION_ACTIONS = Object.values(NotificationAction);

export const NOTIFICATION_TARGET_LABEL: Record<NotificationTarget, string> = {
  ALL: "Todos os clientes",
  NO_ORDERS: "Clientes sem pedidos",
  ABANDONED_CART: "Carrinho abandonado",
  INACTIVE_30_DAYS: "Inativos há 30 dias",
  SINGLE_ORDER: "Clientes com um único pedido",
};

export const NOTIFICATION_ACTION_LABEL: Record<NotificationAction, string> = {
  REDIRECT_TO_ORDERS: "Redirecionar para pedidos",
};
