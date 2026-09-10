import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { IProductWithCategory } from "@shared/models";
import { twMerge } from "tailwind-merge";
import { ProductCard } from "./product-card";

type Props = {
  product: IProductWithCategory;
  position: number;
  isReordering: boolean;
  isPending: boolean;
  onToggle: () => void;
  onRemove: () => void;
};

export const SortableProductCard = ({
  product,
  position,
  isReordering,
  isPending,
  onToggle,
  onRemove,
}: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: product.id,
    disabled: !isReordering,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragProps = isReordering ? { ...attributes, ...listeners } : {};

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...dragProps}
      className={twMerge(
        "h-full rounded-lg",
        isReordering &&
          "cursor-grab active:cursor-grabbing focus:outline-none focus:ring-1 focus:ring-amber-500",
      )}
    >
      <ProductCard
        product={product}
        position={position}
        isReordering={isReordering}
        isPending={isPending}
        isDragging={isDragging}
        onToggle={onToggle}
        onRemove={onRemove}
      />
    </div>
  );
};
