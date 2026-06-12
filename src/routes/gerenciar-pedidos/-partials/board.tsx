import { useState } from "react";
import { ConfirmModal } from "@components";
import type { IOrderWithItems } from "@shared/models";
import { OrderStatus } from "@shared/models";
import { Column } from "./column";
import { CancelOrderModal } from "./cancel-order-modal";
import { ORDER_STATUS_LABEL } from "@shared/helpers/order-status";
import { useOrdersService } from "@services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

  const { updateOrderStatus, getOrdersManagement } = useOrdersService();
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: (statusReason: string | undefined) =>
      updateOrderStatus({
        orderId: pendingMove!.order.id,
        body: {
          status: pendingMove!.toStatus,
          ...(statusReason ? { statusReason } : {}),
        },
      }),
    onSuccess: (updatedOrders) => {
      toast.success("Pedido atualizado com sucesso!");
      queryClient.setQueryData([getOrdersManagement.key], updatedOrders);

      setPendingMove(null);
    },
  });

  const onDropOrder = (orderId: string, toStatus: OrderStatus) => {
    const flatArrayOrders = Object.values(orders).flat();
    const order = flatArrayOrders.find((order) => order.id === orderId)!;

    setPendingMove({ order, toStatus });
  };

  const isCancelling = pendingMove?.toStatus === OrderStatus.CANCELLED;

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-4 h-300">
        {COLUMN_ORDER.map((status) => (
          <Column
            key={status}
            status={status}
            orders={orders[status]}
            draggingStatus={draggingStatus}
            onDropOrder={onDropOrder}
            onOrderDragStart={() => setDraggingStatus(status)}
            onOrderDragEnd={() => setDraggingStatus(null)}
          />
        ))}
      </div>

      <ConfirmModal
        isOpen={pendingMove !== null && !isCancelling}
        title="Mover pedido"
        description={
          pendingMove
            ? `Mover o pedido #${pendingMove.order.orderNumber} para "${ORDER_STATUS_LABEL[pendingMove.toStatus]}"?`
            : undefined
        }
        confirmLabel="Mover"
        onClose={() => setPendingMove(null)}
        onConfirm={() => updateStatusMutation.mutate(undefined)}
      />

      <CancelOrderModal
        isOpen={pendingMove !== null && isCancelling}
        orderNumber={pendingMove?.order.orderNumber}
        isPending={updateStatusMutation.isPending}
        onClose={() => setPendingMove(null)}
        onConfirm={(statusReason) => updateStatusMutation.mutate(statusReason)}
      />
    </>
  );
};
