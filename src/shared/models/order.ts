export interface IOrder {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  address: string;
  customerId: string;
  orderNumber: number;
  statusReason: string | null;
  deliveryFee: number;
  paymentType: PaymentType;
}

export interface IOrderItem {
  id: string;
  orderId: string;
  productId: string;
  name: string;
  imageUrl: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface IOrderWithItems extends IOrder {
  items: IOrderItem[];
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
