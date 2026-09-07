import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ICategoryWithProductsCount } from "@shared/models";
import { twMerge } from "tailwind-merge";
import { CategoryCard } from "./category-card";

type Props = {
  category: ICategoryWithProductsCount;
  position: number;
  isReordering: boolean;
  isPending: boolean;
  originGroupName: string | null;
  onToggle: () => void;
  onRemove: () => void;
};

export const SortableCategoryCard = ({
  category,
  position,
  isReordering,
  isPending,
  originGroupName,
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
    id: category.id,
    data: { type: "category" },
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
      <CategoryCard
        category={category}
        position={position}
        isReordering={isReordering}
        isPending={isPending}
        isDragging={isDragging}
        originGroupName={originGroupName}
        onToggle={onToggle}
        onRemove={onRemove}
      />
    </div>
  );
};
