import type { OrderStatus } from "@shared/models";
import { ORDER_STATUS_TRANSITIONS } from "../../../-helpers";

export const canMoveOrder = (from: OrderStatus, to: OrderStatus): boolean =>
  ORDER_STATUS_TRANSITIONS[from].includes(to);
