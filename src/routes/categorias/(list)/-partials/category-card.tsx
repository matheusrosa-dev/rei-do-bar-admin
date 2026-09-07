import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ImagePreview, Toggle, Tooltip, TrashButton } from "@components";
import type { ICategoryWithProductsCount } from "@shared/models";
import { Link } from "@tanstack/react-router";
import { MdDragIndicator } from "react-icons/md";
import { twMerge } from "tailwind-merge";

type Props = {
  category: ICategoryWithProductsCount;
  position: number;
  isReordering: boolean;
  isPending: boolean;
  onToggle: () => void;
  onRemove: () => void;
};

export const CategoryCard = ({
  category,
  position,
  isReordering,
  isPending,
  onToggle,
  onRemove,
}: Props) => {
  const hasProducts = category.productsCount > 0;
  const isMoved = isReordering && category.sortOrder !== position;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id, disabled: !isReordering });

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
        "relative p-4 rounded-lg border border-white/10 bg-white/5 transition-colors duration-150 flex flex-col gap-4 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500",
        !isReordering && "hover:bg-white/10",
        isReordering &&
          "select-none cursor-grab active:cursor-grabbing focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500",
        isMoved && "border-amber-500/40 bg-amber-500/5",
        isDragging && "opacity-50 border-amber-500/10 bg-amber-500/5 z-50",
      )}
    >
      <div className="flex items-start gap-3">
        <span className="relative z-10">
          <ImagePreview src={category.imageUrl} className="w-14 h-14" />
        </span>

        <div className="flex flex-col gap-0.5 min-w-0">
          {isReordering ? (
            <span className="text-white text-sm font-medium break-words">
              {category.name}
            </span>
          ) : (
            <Link
              to="/categorias/editar/$categoryId"
              params={{ categoryId: category.id }}
              className="text-white text-sm font-medium break-words focus:outline-none after:absolute after:inset-0 after:cursor-pointer"
            >
              {category.name}
            </Link>
          )}

          <span className="text-xs text-gray-400 break-words">
            {category.pluralName}
          </span>
        </div>

        {isReordering && (
          <MdDragIndicator
            size={18}
            className="ml-auto shrink-0 text-zinc-500"
          />
        )}
      </div>

      <span className="text-sm text-gray-400">
        {category.productsCount} produto
        {category.productsCount !== 1 ? "s" : ""}
      </span>

      {isMoved && (
        <span className="text-xs text-amber-500 font-medium">
          Posição original: {category.sortOrder}
        </span>
      )}

      {!isReordering && (
        <div className="relative z-10 mt-auto flex items-center justify-between gap-3">
          <Toggle
            checked={category.isActive}
            onCheckedChange={onToggle}
            disabled={isPending}
          />

          <Tooltip
            disabled={!hasProducts}
            content={
              <>
                Não é possível remover essa categoria
                <br /> pois ela possui produtos vinculados.
              </>
            }
          >
            <span>
              <TrashButton
                disabled={hasProducts || isPending}
                onClick={onRemove}
              />
            </span>
          </Tooltip>
        </div>
      )}
    </div>
  );
};
