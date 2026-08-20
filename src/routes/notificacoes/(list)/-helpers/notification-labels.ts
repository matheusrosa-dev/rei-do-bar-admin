import {
  NotificationAction,
  NotificationStatus,
  NotificationTarget,
} from "@shared/models";

type StatusVariant = "active" | "inactive";

export const NOTIFICATION_TARGETS = Object.values(NotificationTarget);
export const NOTIFICATION_ACTIONS = Object.values(NotificationAction);
export const NOTIFICATION_STATUSES = Object.values(NotificationStatus);

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

export const NOTIFICATION_STATUS_LABEL: Record<NotificationStatus, string> = {
  SENT: "Enviada",
  FAILED: "Falhou",
};

export const NOTIFICATION_STATUS_VARIANT: Record<
  NotificationStatus,
  StatusVariant
> = {
  SENT: "active",
  FAILED: "inactive",
};

export const TARGET_FILTER_OPTIONS = NOTIFICATION_TARGETS.map((target) => ({
  value: target,
  label: NOTIFICATION_TARGET_LABEL[target],
}));

export const STATUS_FILTER_OPTIONS = NOTIFICATION_STATUSES.map((status) => ({
  value: status,
  label: NOTIFICATION_STATUS_LABEL[status],
}));
