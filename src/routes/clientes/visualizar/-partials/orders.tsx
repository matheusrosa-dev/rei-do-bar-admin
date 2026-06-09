import { useState } from "react";
import { ImagePreview, StatusBadge, Wrapper } from "@components";
import type { IOrderWithItems } from "@shared/models";
import { formatPrice } from "@shared/helpers/number";
import { formatDate } from "@shared/helpers/string";
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_VARIANT,
  PAYMENT_TYPE_LABEL,
} from "../-helpers";
import { PiCaretDownBold } from "react-icons/pi";

type Props = {
  orders: IOrderWithItems[];
};

export const Orders = ({ orders }: Props) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  if (orders.length === 0) {
    return (
      <Wrapper className="flex flex-col gap-4">
        <h2 className="text-white text-lg font-bold">Pedidos</h2>
        <hr className="border-white/10" />
        <span className="text-gray-400 text-sm">Nenhum pedido encontrado.</span>
      </Wrapper>
    );
  }

  return (
    <Wrapper className="flex flex-col gap-4">
      <h2 className="text-white text-lg font-bold">
        Pedidos ({orders.length})
      </h2>

      <hr className="border-white/10" />

      <div className="flex flex-col gap-3">
        {orders.map((order) => {
          const itemsTotal = order.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          );
          const total = itemsTotal + order.deliveryFee;
          const isExpanded = expandedIds.has(order.id);

          return (
            <div
              key={order.id}
              className="flex flex-col rounded-lg bg-white/5 border border-white/10"
            >
              <button
                type="button"
                className=" p-3 cursor-pointer flex flex-col gap-3"
                onClick={() => toggle(order.id)}
              >
                <div className="flex items-center justify-between gap-2 text-left w-full">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500 font-bold text-md">
                      #{order.orderNumber}
                    </span>
                    <StatusBadge variant={ORDER_STATUS_VARIANT[order.status]}>
                      {ORDER_STATUS_LABEL[order.status]}
                    </StatusBadge>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm font-medium">
                      {formatDate(order.createdAt)}
                    </span>
                    <PiCaretDownBold
                      className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                  <span>
                    <span className="text-gray-500">Pagamento: </span>
                    <span className="text-gray-300 font-bold">
                      {PAYMENT_TYPE_LABEL[order.paymentType]}
                    </span>
                  </span>

                  <span>
                    <span className="text-gray-500">Itens: </span>
                    <span className="text-gray-300 font-bold">
                      {order.items.length}
                    </span>
                  </span>

                  <span>
                    <span className="text-gray-500">Subtotal: </span>
                    <span className="text-gray-300 font-bold">
                      {formatPrice(itemsTotal)}
                    </span>
                  </span>

                  <span>
                    <span className="text-gray-500">Frete: </span>
                    <span className="text-gray-300 font-bold">
                      {formatPrice(order.deliveryFee)}
                    </span>
                  </span>

                  <span>
                    <span className="text-gray-500">Total: </span>
                    <span className="text-amber-500 font-bold">
                      {formatPrice(total)}
                    </span>
                  </span>
                </div>

                {order.statusReason && (
                  <span className="text-xs text-red-400">
                    Motivo: {order.statusReason}
                  </span>
                )}
              </button>

              {isExpanded && (
                <div className="flex flex-col gap-2 p-3 border-t border-white/10 ">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <ImagePreview
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12"
                      />
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
              )}
            </div>
          );
        })}
      </div>
    </Wrapper>
  );
};
