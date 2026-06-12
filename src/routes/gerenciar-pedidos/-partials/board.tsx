import { useState } from "react";
import { ConfirmModal } from "@components";
import type { IOrderWithItems } from "@shared/models";
import { OrderStatus } from "@shared/models";
import { Column } from "./column";
import { ORDER_STATUS_LABEL } from "@shared/helpers/order-status";

type Props = {
  orders: Record<OrderStatus, IOrderWithItems[]>;
};

type PendingMove = {
  order: IOrderWithItems;
  toStatus: OrderStatus;
};

const COLUMN_ORDER: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.PREPARING,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED,
];

export const Board = ({ orders }: Props) => {
  const [pendingMove, setPendingMove] = useState<PendingMove | null>(null);
  const [draggingStatus, setDraggingStatus] = useState<OrderStatus | null>(
    null,
  );

  const handleDropOrder = (orderId: string, toStatus: OrderStatus) => {
    const flatArrayOrders = Object.values(orders).flat();
    const order = flatArrayOrders.find((order) => order.id === orderId)!;

    setPendingMove({ order, toStatus });
  };

  const confirmMove = () => {
    setPendingMove(null);
  };

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-100">
        {COLUMN_ORDER.map((status) => (
          <Column
            key={status}
            status={status}
            orders={orders[status]}
            draggingStatus={draggingStatus}
            onDropOrder={handleDropOrder}
            onOrderDragStart={() => setDraggingStatus(status)}
            onOrderDragEnd={() => setDraggingStatus(null)}
          />
        ))}
      </div>

      <ConfirmModal
        isOpen={pendingMove !== null}
        title="Mover pedido"
        description={
          pendingMove
            ? `Mover o pedido #${pendingMove.order.orderNumber} para "${ORDER_STATUS_LABEL[pendingMove.toStatus]}"?`
            : undefined
        }
        confirmLabel="Mover"
        variant={
          pendingMove?.toStatus === OrderStatus.CANCELLED ? "danger" : "default"
        }
        onClose={() => setPendingMove(null)}
        onConfirm={confirmMove}
      />
    </>
  );
};
