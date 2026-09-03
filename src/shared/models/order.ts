import type { ICustomer } from "./customer";
import type { IOrderDeliveryPerson } from "./delivery-person";

export interface IOrder {
  id: string;
  createdAt: string;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  updatedAt: string;
  status: OrderStatus;
  address: string;
  customerId: string;
  orderNumber: number;
  statusReason: string | null;
  deliveryPerson: IOrderDeliveryPerson | null;
  deliveryPersonIsVolunteer: boolean;
  deliveryPersonBonus: number;
  deliveryFee: number;
  paymentType: PaymentType;
  couponCode: string | null;
  couponDiscount: number;
  productsTotal: number;
  productsDiscount: number;
  total: number;
}

export interface IOrderItem {
  id: string;
  orderId: string;
  productId: string;
  name: string;
  imageUrl: string;
  quantity: number;
  price: number;
  compareAtPrice: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface IOrderWithItems extends IOrder {
  items: IOrderItem[];
}

export interface IOrderWithItemsAndCustomer extends IOrderWithItems {
  customer: ICustomer;
}

export enum OrderStatus {
  PENDING = "PENDING",
  PREPARING = "PREPARING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentType {
  CASH = "CASH",
  CARD = "CARD",
  PIX = "PIX",
}
