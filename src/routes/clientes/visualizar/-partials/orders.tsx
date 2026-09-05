import { useState } from "react";
import { ImagePreview, StatusBadge, Wrapper } from "@components";
import type { IOrderWithItems } from "@shared/models";
import { formatPrice } from "@shared/helpers/number";
import { formatDateTime } from "@shared/helpers/string";
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_VARIANT,
  PAYMENT_TYPE_LABEL,
} from "@shared/helpers/order-status";
import { Link } from "@tanstack/react-router";
import { PiCaretDownBold } from "react-icons/pi";
import { RiExternalLinkLine } from "react-icons/ri";

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
          const isExpanded = expandedIds.has(order.id);

          return (
            <div
              key={order.id}
              className="flex flex-col rounded-lg bg-white/5 border border-white/10"
            >
              <div
                className="p-3 cursor-pointer flex flex-col gap-3 items-start"
                onClick={() => toggle(order.id)}
              >
                <div className="flex items-center justify-between gap-2 text-left w-full">
                  <div className="flex items-center gap-2">
                    <Link
                      className="text-amber-500 font-bold text-md flex items-center gap-1 hover:underline"
                      to="/pedidos"
                      search={{ searchTerm: String(order.orderNumber) }}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      #{order.orderNumber}
                      <RiExternalLinkLine />
                    </Link>
                    <StatusBadge variant={ORDER_STATUS_VARIANT[order.status]}>
                      {ORDER_STATUS_LABEL[order.status]}
                    </StatusBadge>
                  </div>

                  <button
                    type="button"
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(order.id);
                    }}
                  >
                    <span className="text-gray-400 text-sm font-medium">
                      {formatDateTime(order.createdAt)}
                    </span>
                    <PiCaretDownBold
                      className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                <div className="flex gap-4 text-sm text-left text-gray-400">
                  <span>
                    <span className="text-gray-500">Pagamento: </span>
                    <span className="text-gray-300 font-bold">
                      {PAYMENT_TYPE_LABEL[order.paymentType]}
                    </span>
                  </span>

                  {order.couponDiscount > 0 && (
                    <span className="flex gap-2">
                      <span>
                        <span className="text-gray-500">Cupom: </span>
                        <span className="text-green-400 font-bold">
                          -{formatPrice(order.couponDiscount)}
                        </span>
                      </span>
                      {order.couponCode && (
                        <StatusBadge variant="neutral">
                          {order.couponCode}
                        </StatusBadge>
                      )}
                    </span>
                  )}

                  <span>
                    <span className="text-gray-500">Total: </span>
                    <span className="text-amber-500 font-bold">
                      {formatPrice(order.total)}
                    </span>
                  </span>
                </div>

                {order.statusReason && (
                  <span className="text-xs text-red-400">
                    Motivo: {order.statusReason}
                  </span>
                )}
              </div>

              {isExpanded && (
                <div className="flex flex-col gap-2 p-3 border-t border-white/10 ">
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
              )}
            </div>
          );
        })}
      </div>
    </Wrapper>
  );
};
