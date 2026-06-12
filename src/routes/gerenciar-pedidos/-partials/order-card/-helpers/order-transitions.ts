import type { OrderStatus } from "@shared/models";
import { ORDER_STATUS_TRANSITIONS } from "../../../-helpers";

export const isOrderMovable = (status: OrderStatus): boolean =>
  ORDER_STATUS_TRANSITIONS[status].length > 0;
