import { useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { MdInbox } from "react-icons/md";
import { StatusBadge } from "@components";
import type { IOrderWithItemsAndCustomer } from "@shared/models";
import { OrderStatus } from "@shared/models";
import { canMoveOrder } from "./-helpers";
import { OrderCard } from "../order-card";
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_VARIANT,
} from "@shared/helpers/order-status";

const COLUMN_HINT: Partial<Record<OrderStatus, string>> = {
  [OrderStatus.DELIVERED]: "Últimas 10 horas",
  [OrderStatus.CANCELLED]: "Últimas 10 horas",
};

type Props = {
  status: OrderStatus;
  orders: IOrderWithItemsAndCustomer[];
  draggingStatus: OrderStatus | null;
  onDropOrder: (orderId: string, status: OrderStatus) => void;
  onOrderDragStart: () => void;
  onOrderDragEnd: () => void;
  onEditDeliveryPerson: (order: IOrderWithItemsAndCustomer) => void;
};

export const Column = ({
  status,
  orders,
  draggingStatus,
  onDropOrder,
  onOrderDragStart,
  onOrderDragEnd,
  onEditDeliveryPerson,
}: Props) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [isOver, setIsOver] = useState(false);

  const isValidTarget =
    draggingStatus !== null && canMoveOrder(draggingStatus, status);

  const isDangerTarget =
    status === OrderStatus.DELIVERED || status === OrderStatus.CANCELLED;

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsOver(false);
    const orderId = event.dataTransfer.getData("text/plain");
    if (orderId) onDropOrder(orderId, status);
  };

  const getDropAreaClass = () => {
    if (isValidTarget && isOver && isDangerTarget)
      return "bg-red-500/10 outline-2 outline-dashed outline-red-500/40";

    if (isValidTarget && isOver)
      return "bg-white/5 outline-2 outline-dashed outline-amber-500/40";

    if (isValidTarget) return "outline-2 outline-dashed outline-white/20";

    return "";
  };

  return (
    <div className="flex flex-col gap-3 w-80 rounded-xl bg-white/8 p-3">
      <div className="flex items-center gap-2 px-1">
        <StatusBadge variant={ORDER_STATUS_VARIANT[status]}>
          {ORDER_STATUS_LABEL[status]}
        </StatusBadge>
        <span className="text-gray-500 text-sm font-medium">
          {orders.length}
        </span>
        {COLUMN_HINT[status] && (
          <span className="ml-auto text-gray-500 text-xs">
            {COLUMN_HINT[status]}
          </span>
        )}
      </div>

      <div className="relative overflow-y-auto h-full">
        <div
          className={`flex flex-col gap-3 rounded-lg transition-colors h-[99%] m-px ${getDropAreaClass()}`}
          onDragOver={(event) => {
            if (!isValidTarget) return;
            event.preventDefault();
            setIsOver(true);
          }}
          onDragLeave={() => setIsOver(false)}
          onDrop={handleDrop}
        >
          {orders.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-8 text-gray-500">
              <MdInbox size={32} />
              <span className="text-sm">Nenhum pedido</span>
            </div>
          ) : (
            orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isExpanded={expandedOrderId === order.id}
                onExpandOrderId={setExpandedOrderId}
                onDragStart={onOrderDragStart}
                onDragEnd={onOrderDragEnd}
                onEditDeliveryPerson={onEditDeliveryPerson}
              />
            ))
          )}
        </div>

        {isOver && isValidTarget && isDangerTarget && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="bg-red-900/80 p-4 rounded-full">
              <FiAlertTriangle className="text-red-500" size={48} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
