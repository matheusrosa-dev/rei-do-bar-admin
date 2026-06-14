import type { ICategory } from "@shared/models";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragIndicator } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { StatusBadge } from "@components";

type Props = {
  category: ICategory;
  index: number;
};

export function SortableItem({ category, index }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

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
        <span className="text-sm text-gray-200 truncate w-50">
          {category.name}
        </span>

        <StatusBadge variant={category.isActive ? "active" : "inactive"}>
          {category.isActive ? "Ativo" : "Inativo"}
        </StatusBadge>
      </div>

      {category.sortOrder !== index + 1 && (
        <span className="text-xs text-amber-500 font-medium">
          Posição original: {category.sortOrder}
        </span>
      )}
    </div>
  );
}
