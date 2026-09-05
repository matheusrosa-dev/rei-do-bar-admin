import { useState } from "react";
import { ConfirmModal } from "@components";
import type { IOrderWithItemsAndCustomer } from "@shared/models";
import { OrderStatus } from "@shared/models";
import { Column } from "./column";
import { CancelOrderModal } from "./cancel-order-modal";
import { EditDeliveryPersonModal } from "./edit-delivery-person-modal";
import { ShipOrderModal } from "./ship-order-modal";
import { ORDER_STATUS_LABEL } from "@shared/helpers/order-status";
import { useOrdersService } from "@services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  orders: Record<OrderStatus, IOrderWithItemsAndCustomer[]>;
};

type ModalOpen =
  | {
      mode: "move";
      order: IOrderWithItemsAndCustomer;
      toStatus: OrderStatus;
    }
  | { mode: "edit-delivery-person"; order: IOrderWithItemsAndCustomer };

const CONFIRM_DELIVERY_DELAY_SECONDS = 10;

const COLUMN_ORDER: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.PREPARING,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED,
];

export const Board = ({ orders }: Props) => {
  const [modalOpen, setModalOpen] = useState<ModalOpen | null>(null);
  const [draggingStatus, setDraggingStatus] = useState<OrderStatus | null>(
    null,
  );

  const {
    updateOrderStatus,
    updateOrderDeliveryPerson,
    getOrders,
    getOrdersManagement,
  } = useOrdersService();
  const queryClient = useQueryClient();

  const pendingMove = modalOpen?.mode === "move" ? modalOpen : null;

  const editingOrder =
    modalOpen?.mode === "edit-delivery-person" ? modalOpen.order : null;

  const updateStatusMutation = useMutation({
    mutationFn: (input: { statusReason?: string; deliveryPersonId?: string }) =>
      updateOrderStatus({
        orderId: pendingMove!.order.id,
        body: {
          status: pendingMove!.toStatus,
          ...(input.statusReason ? { statusReason: input.statusReason } : {}),
          ...(input.deliveryPersonId
            ? { deliveryPersonId: input.deliveryPersonId }
            : {}),
        },
      }),
    onSuccess: (updatedOrders) => {
      toast.success("Pedido atualizado com sucesso!");
      queryClient.setQueryData([getOrdersManagement.key], updatedOrders);
      queryClient.invalidateQueries({ queryKey: [getOrders.key] });

      setModalOpen(null);
    },
  });

  const updateDeliveryPersonMutation = useMutation({
    mutationFn: (deliveryPersonId: string) =>
      updateOrderDeliveryPerson({
        orderId: editingOrder!.id,
        body: { deliveryPersonId },
      }),
    onSuccess: () => {
      toast.success("Entregador atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: [getOrdersManagement.key] });
      queryClient.invalidateQueries({ queryKey: [getOrders.key] });

      setModalOpen(null);
    },
  });

  const onDropOrder = (orderId: string, toStatus: OrderStatus) => {
    const flatArrayOrders = Object.values(orders).flat();
    const order = flatArrayOrders.find((order) => order.id === orderId)!;

    setModalOpen({ mode: "move", order, toStatus });
  };

  const isCancelling = pendingMove?.toStatus === OrderStatus.CANCELLED;
  const isShipping = pendingMove?.toStatus === OrderStatus.SHIPPED;
  const isDelivering = pendingMove?.toStatus === OrderStatus.DELIVERED;

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
            onEditDeliveryPerson={(order) =>
              setModalOpen({ mode: "edit-delivery-person", order })
            }
          />
        ))}
      </div>

      <ConfirmModal
        isOpen={
          pendingMove !== null && !isCancelling && !isShipping && !isDelivering
        }
        title="Mover pedido"
        description={
          pendingMove ? (
            <>
              Mover o pedido{" "}
              <strong className="font-bold text-white">
                #{pendingMove.order.orderNumber}
              </strong>{" "}
              para "{ORDER_STATUS_LABEL[pendingMove.toStatus]}"?
            </>
          ) : undefined
        }
        confirmLabel="Mover"
        onClose={() => setModalOpen(null)}
        onConfirm={() => updateStatusMutation.mutate({})}
      />

      <ConfirmModal
        isOpen={pendingMove !== null && isDelivering}
        variant="danger"
        title="Confirmar entrega"
        description={
          pendingMove ? (
            <>
              A confirmação de entrega normalmente deve ser feita pelo
              entregador. Confirme apenas se tiver certeza de que o pedido{" "}
              <strong className="font-bold text-white">
                #{pendingMove.order.orderNumber}
              </strong>{" "}
              foi entregue.
            </>
          ) : undefined
        }
        confirmLabel="Confirmar entrega"
        confirmDelaySeconds={CONFIRM_DELIVERY_DELAY_SECONDS}
        canClose={!updateStatusMutation.isPending}
        onClose={() => setModalOpen(null)}
        onConfirm={() => updateStatusMutation.mutate({})}
      />

      <CancelOrderModal
        isOpen={pendingMove !== null && isCancelling}
        orderNumber={pendingMove?.order.orderNumber}
        isPending={updateStatusMutation.isPending}
        onClose={() => setModalOpen(null)}
        onConfirm={(statusReason) =>
          updateStatusMutation.mutate({ statusReason })
        }
      />

      <ShipOrderModal
        isOpen={pendingMove !== null && isShipping}
        orderNumber={pendingMove?.order.orderNumber}
        isPending={updateStatusMutation.isPending}
        onClose={() => setModalOpen(null)}
        onConfirm={(deliveryPersonId) =>
          updateStatusMutation.mutate({ deliveryPersonId })
        }
      />

      <EditDeliveryPersonModal
        isOpen={editingOrder !== null}
        orderNumber={editingOrder?.orderNumber}
        currentDeliveryPersonId={editingOrder?.deliveryPerson?.id ?? null}
        isPending={updateDeliveryPersonMutation.isPending}
        onClose={() => setModalOpen(null)}
        onConfirm={updateDeliveryPersonMutation.mutate}
      />
    </>
  );
};
