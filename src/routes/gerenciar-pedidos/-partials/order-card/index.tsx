import { useState } from "react";
import { ImagePreview } from "@components";
import type { IOrderWithItems } from "@shared/models";
import { formatPrice } from "@shared/helpers/number";
import { formatDate } from "@shared/helpers/string";
import { PiCaretDownBold } from "react-icons/pi";
import { isOrderMovable } from "./-helpers";
import { PAYMENT_TYPE_LABEL } from "@shared/helpers/order-status";

type Props = {
  order: IOrderWithItems;
  onDragStart: () => void;
  onDragEnd: () => void;
};

export const OrderCard = ({ order, onDragStart, onDragEnd }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
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

  const itemsTotal = order.items.reduce(
    (sum, current) => sum + current.price * current.quantity,
    0,
  );
  const total = itemsTotal + order.deliveryFee;
  const isMovable = isOrderMovable(order.status);

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
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <div className="flex items-center justify-between gap-2 w-full">
          <span className="text-amber-500 font-bold">#{order.orderNumber}</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs font-medium">
              {formatDate(order.createdAt)}
            </span>
            <PiCaretDownBold
              className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span className="text-gray-300 font-bold">
            {PAYMENT_TYPE_LABEL[order.paymentType]}
          </span>
          <span className="text-gray-500">·</span>
          <span>
            {order.items.length} {order.items.length === 1 ? "item" : "itens"}
          </span>
        </div>

        <span className="text-gray-400 text-xs truncate w-full">
          {order.address}
        </span>

        <div className="flex items-center justify-between w-full">
          <span className="text-gray-500 text-xs">Total</span>
          <span className="text-amber-500 font-bold text-sm">
            {formatPrice(total)}
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
                className="w-10 h-10"
              />
              <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
                <div className="flex flex-col min-w-0">
                  <span className="text-gray-200 text-xs font-medium truncate">
                    {current.name}
                  </span>
                  <span className="text-gray-500 text-xs font-medium">
                    {current.quantity}x {formatPrice(current.price)}
                  </span>
                </div>
                <span className="text-gray-300 text-xs font-bold">
                  {formatPrice(current.price * current.quantity)}
                </span>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between border-t border-white/10 pt-2">
            <span className="text-gray-500 text-xs">Frete</span>
            <span className="text-gray-300 text-xs font-bold">
              {formatPrice(order.deliveryFee)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
