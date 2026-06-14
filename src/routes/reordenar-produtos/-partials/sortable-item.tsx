import type { IProduct } from "@shared/models";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragIndicator } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { ImagePreview, StatusBadge } from "@components";
import { formatPrice } from "@shared/helpers/number";

type Props = {
  product: IProduct;
  index: number;
};

export function SortableItem({ product, index }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(
      transform ? { ...transform, x: 0 } : null,
    ),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={twMerge(
        "flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 select-none cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50 border-amber-500/10 bg-amber-500/5 z-50",
      )}
    >
      <MdDragIndicator size={20} className="text-zinc-500" />

      <span className="w-6 text-center text-xs font-semibold text-zinc-500 shrink-0">
        {index + 1}
      </span>

      <div className="flex items-center gap-4 flex-1">
        <ImagePreview src={product.imageUrl} className="h-12 w-12" />

        <span className="text-sm text-gray-200 truncate w-50">
          {product.name}
        </span>

        <span className="text-sm text-gray-200 truncate w-20">
          {formatPrice(product.price)}
        </span>

        <span className="w-34 flex gap-4">
          <StatusBadge variant={product.isActive ? "active" : "inactive"}>
            {product.isActive ? "Ativo" : "Inativo"}
          </StatusBadge>

          {!product.stock && (
            <StatusBadge variant="alert">Esgotado</StatusBadge>
          )}
        </span>
      </div>

      {product.sortOrder !== index + 1 && (
        <span className="text-xs text-amber-500 font-medium">
          Posição original: {product.sortOrder}
        </span>
      )}
    </div>
  );
}
