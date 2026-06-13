import { useState } from "react";
import { ImagePreview } from "@components";
import { OrderStatus, type IOrderWithItems } from "@shared/models";
import { formatPrice } from "@shared/helpers/number";
import { formatTime } from "@shared/helpers/string";
import { PiCaretDownBold } from "react-icons/pi";
import { isOrderMovable } from "./-helpers";
import { PAYMENT_TYPE_LABEL } from "@shared/helpers/order-status";

type Props = {
  order: IOrderWithItems;
  isExpanded: boolean;
  onExpandOrderId: (id: string | null) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
};

export const OrderCard = ({
  order,
  isExpanded,
  onExpandOrderId,
  onDragStart,
  onDragEnd,
}: Props) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("text/plain", order.id);
    event.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
    onDragStart();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd();
  };

  const isMovable = isOrderMovable(order.status);

  const itemsCount = order.items.reduce((acc, cur) => acc + cur.quantity, 0);

  return (
    <div
      draggable={isMovable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`flex flex-col rounded-lg bg-white/5 border border-white/10 transition-opacity ${isMovable ? "cursor-grab active:cursor-grabbing" : ""} ${isDragging ? "opacity-50" : ""}`}
    >
      <button
        type="button"
        className="p-3 cursor-pointer flex flex-col gap-2 text-left"
        onClick={() => onExpandOrderId(isExpanded ? null : order.id)}
      >
        <div className="flex items-center justify-between gap-2 w-full">
          <span className="text-amber-500 font-bold">#{order.orderNumber}</span>
          <PiCaretDownBold
            className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        </div>

        <div className="flex items-center gap-1.5 text-sm text-gray-400">
          <span className="text-gray-300 font-bold">
            {PAYMENT_TYPE_LABEL[order.paymentType]}
          </span>
          <span className="text-gray-500">·</span>
          <span>
            {itemsCount}

            {itemsCount === 1 ? " item" : " itens"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-gray-400">
          <span>Criado em: {formatTime(order.createdAt)}</span>
          {order.status !== OrderStatus.PENDING && (
            <>
              <span className="text-gray-500">·</span>
              <span>Alterado em: {formatTime(order.updatedAt)}</span>
            </>
          )}
        </div>

        <span className="text-gray-400 text-sm w-full">{order.address}</span>

        <div className="flex items-center justify-between w-full">
          <span className="text-gray-500 text-sm">Total</span>
          <span className="text-amber-500 font-bold text-sm">
            {formatPrice(order.total)}
          </span>
        </div>

        {order.statusReason && (
          <span className="text-xs text-red-400">
            Motivo: {order.statusReason}
          </span>
        )}
      </button>

      {isExpanded && (
        <div className="flex flex-col gap-2 p-3 border-t border-white/10">
          {order.items.map((current) => (
            <div key={current.id} className="flex items-center gap-3">
              <ImagePreview
                src={current.imageUrl}
                alt={current.name}
                className="w-12 h-12"
              />
              <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
                <div className="flex flex-col min-w-0">
                  <span className="text-gray-200 text-sm font-medium truncate">
                    {current.name}
                  </span>
                  <span className="text-gray-500 text-sm font-medium">
                    {current.quantity}x {formatPrice(current.price)}
                  </span>
                </div>
                <span className="text-gray-300 text-sm font-bold">
                  {formatPrice(current.price * current.quantity)}
                </span>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between border-t border-white/10 pt-2">
            <span className="text-gray-500 text-sm">Frete</span>
            <span className="text-gray-300 text-sm font-bold">
              {formatPrice(order.deliveryFee)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
