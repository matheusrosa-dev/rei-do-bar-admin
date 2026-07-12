import * as RadixDialog from "@radix-ui/react-dialog";
import { ImagePreview, Modal, StatusBadge } from "@components";
import { formatPrice } from "@shared/helpers/number";
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_VARIANT,
  PAYMENT_TYPE_LABEL,
} from "@shared/helpers/order-status";
import { formatDateTime } from "@shared/helpers/string";
import { OrderStatus, type IOrderWithItemsAndCustomer } from "@shared/models";
import { Link } from "@tanstack/react-router";
import { RiExternalLinkLine } from "react-icons/ri";

type Props = {
  order: IOrderWithItemsAndCustomer | null;
  onClose: () => void;
};

export const OrderDetailModal = ({ order, onClose }: Props) => {
  const isOrderFinalized =
    order?.status === OrderStatus.CANCELLED ||
    order?.status === OrderStatus.DELIVERED;

  return (
    <Modal isOpen={!!order} onClose={onClose}>
      {order && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
              <RadixDialog.Title className="text-white font-bold text-lg">
                Pedido #{order.orderNumber}
              </RadixDialog.Title>

              <StatusBadge variant={ORDER_STATUS_VARIANT[order.status]}>
                {ORDER_STATUS_LABEL[order.status]}
              </StatusBadge>
            </div>

            <RadixDialog.Description className="text-gray-400 text-sm flex flex-col gap-1">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  Criado em:{" "}
                  <span className="text-gray-300 font-bold">
                    {formatDateTime(order.createdAt)}
                  </span>
                </div>

                {isOrderFinalized && (
                  <div>
                    Finalizado em:{" "}
                    <span className="text-gray-300 font-bold">
                      {formatDateTime(order.updatedAt)}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  Pagamento:{" "}
                  <span className="text-gray-300 font-bold">
                    {PAYMENT_TYPE_LABEL[order.paymentType]}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  Cliente:{" "}
                  <Link
                    className="text-gray-300 font-bold underline flex flex-nowrap items-center gap-1 duration-150 hover:text-white"
                    to="/clientes/visualizar/$customerId"
                    params={{
                      customerId: order.customerId,
                    }}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {order.customer.deletedAt
                      ? "Cliente removido"
                      : order.customer.name}
                    <RiExternalLinkLine />
                  </Link>
                </div>
              </div>

              <div>
                Endereço:{" "}
                <span className="text-gray-300 font-bold">{order.address}</span>
              </div>

              {order.statusReason && (
                <span className="text-xs text-red-400 font-normal">
                  Motivo: {order.statusReason}
                </span>
              )}
            </RadixDialog.Description>
          </div>

          <div className="flex flex-col gap-2 border-t border-white/10 pt-3">
            {order.discount > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">Desconto</span>

                  {order.couponCode && (
                    <StatusBadge variant="neutral">
                      {order.couponCode}
                    </StatusBadge>
                  )}
                </div>

                <span className="text-green-400 text-sm font-bold">
                  -{formatPrice(order.discount)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Frete</span>
              <span className="text-gray-300 text-sm font-bold">
                {formatPrice(order.deliveryFee)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Total</span>
              <span className="text-amber-500 font-bold">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 ">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <ImagePreview src={item.imageUrl} className="w-12 h-12" />

                <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
                  <div className="flex flex-col min-w-0">
                    <span className="text-gray-200 text-sm font-medium truncate">
                      {item.name}
                    </span>
                    <span className="text-gray-500 text-sm font-medium">
                      {item.quantity}x {formatPrice(item.price)}
                    </span>
                  </div>

                  <span className="text-gray-300 text-sm font-bold">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
};
