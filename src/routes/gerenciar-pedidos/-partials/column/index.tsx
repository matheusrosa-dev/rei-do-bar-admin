import { useState } from "react";
import { StatusBadge } from "@components";
import type { IOrderWithItems, OrderStatus } from "@shared/models";
import { canMoveOrder } from "./-helpers";
import { OrderCard } from "../order-card";
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_VARIANT,
} from "@shared/helpers/order-status";

type Props = {
  status: OrderStatus;
  orders: IOrderWithItems[];
  draggingStatus: OrderStatus | null;
  onDropOrder: (orderId: string, status: OrderStatus) => void;
  onOrderDragStart: () => void;
  onOrderDragEnd: () => void;
};

export const Column = ({
  status,
  orders,
  draggingStatus,
  onDropOrder,
  onOrderDragStart,
  onOrderDragEnd,
}: Props) => {
  const [isOver, setIsOver] = useState(false);

  const isValidTarget =
    draggingStatus !== null && canMoveOrder(draggingStatus, status);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsOver(false);
    const orderId = event.dataTransfer.getData("text/plain");
    if (orderId) onDropOrder(orderId, status);
  };

  const getDropAreaClass = () => {
    if (isValidTarget && isOver)
      return "bg-white/5 outline-2 outline-dashed outline-amber-500/40";

    if (isValidTarget) return "outline-2 outline-dashed outline-white/10";

    return "";
  };

  return (
    <div className="flex flex-col gap-3 w-80 shrink-0">
      <div className="flex items-center gap-2 px-1">
        <StatusBadge variant={ORDER_STATUS_VARIANT[status]}>
          {ORDER_STATUS_LABEL[status]}
        </StatusBadge>
        <span className="text-gray-500 text-sm font-medium">
          {orders.length}
        </span>
      </div>

      <div
        className={`flex flex-col gap-3 flex-1 rounded-lg transition-colors min-h-24 ${getDropAreaClass()}`}
        onDragOver={(event) => {
          if (!isValidTarget) return;
          event.preventDefault();
          setIsOver(true);
        }}
        onDragLeave={() => setIsOver(false)}
        onDrop={handleDrop}
      >
        {orders.length === 0 ? (
          <span className="text-gray-500 text-xs px-1 py-2">Nenhum pedido</span>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onDragStart={onOrderDragStart}
              onDragEnd={onOrderDragEnd}
            />
          ))
        )}
      </div>
    </div>
  );
};
