import { OrderStatus } from "@shared/models";

const EDITABLE_DELIVERY_PERSON_STATUSES: OrderStatus[] = [
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED,
];

export const canEditDeliveryPerson = (status: OrderStatus): boolean =>
  EDITABLE_DELIVERY_PERSON_STATUSES.includes(status);
