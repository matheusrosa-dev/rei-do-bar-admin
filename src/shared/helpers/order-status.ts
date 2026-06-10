import type { OrderStatus, PaymentType } from "@shared/models";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Pendente",
  PREPARING: "Em preparo",
  SHIPPED: "Em entrega",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
};

export const ORDER_STATUS_VARIANT: Record<
  OrderStatus,
  "active" | "inactive" | "alert"
> = {
  PENDING: "alert",
  PREPARING: "alert",
  SHIPPED: "alert",
  DELIVERED: "active",
  CANCELLED: "inactive",
};

export const PAYMENT_TYPE_LABEL: Record<PaymentType, string> = {
  CASH: "Dinheiro",
  CARD: "Cartão",
  PIX: "PIX",
};
