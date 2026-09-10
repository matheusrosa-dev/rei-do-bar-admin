import { ImagePreview, StatusBadge, Toggle, TrashButton } from "@components";
import { formatPrice } from "@shared/helpers/number";
import type { IProductWithCategory } from "@shared/models";
import { Link } from "@tanstack/react-router";
import { MdDragIndicator } from "react-icons/md";
import { twMerge } from "tailwind-merge";

type Props = {
  product: IProductWithCategory;
  position: number;
  isReordering: boolean;
  isPending: boolean;
  isDragging?: boolean;
  onToggle: () => void;
  onRemove: () => void;
};

export const ProductCard = ({
  product,
  position,
  isReordering,
  isPending,
  isDragging,
  onToggle,
  onRemove,
}: Props) => {
  const isMoved = isReordering && product.sortOrder !== position;

  return (
    <div
      className={twMerge(
        "relative h-full p-4 rounded-lg border border-white/10 bg-white/5 transition-colors duration-150 flex flex-col gap-4 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500",
        !isReordering && "hover:bg-white/10",
        isReordering && "select-none",
        isMoved && "border-amber-500/40 bg-amber-500/5",
        isDragging && "opacity-40 border-amber-500/10 bg-amber-500/5",
      )}
    >
      <div className="flex items-start gap-3">
        <span className="relative z-10">
          <ImagePreview src={product.imageUrl} className="w-14 h-14" />
        </span>

        <div className="flex flex-col gap-0.5 min-w-0">
          {isReordering ? (
            <span className="text-white text-sm font-medium break-words">
              {product.name}
            </span>
          ) : (
            <Link
              to="/produtos/editar/$productId"
              params={{ productId: product.id }}
              className="text-white text-sm font-medium break-words focus:outline-none after:absolute after:inset-0 after:cursor-pointer"
            >
              {product.name}
            </Link>
          )}

          <span className="text-xs text-gray-400 break-words">
            {product.category.name}
          </span>
        </div>

        {isReordering && (
          <MdDragIndicator
            size={18}
            className="ml-auto shrink-0 text-zinc-500"
          />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-white text-sm font-medium">
          {formatPrice(product.price)}
        </span>

        {product.compareAtPrice ? (
          <span className="text-xs text-gray-400 line-through">
            {formatPrice(product.compareAtPrice)}
          </span>
        ) : null}
      </div>

      {product.stockQuantity === 0 ? (
        <StatusBadge variant="alert">Esgotado</StatusBadge>
      ) : (
        <span className="text-sm text-gray-400">
          {product.stockQuantity} em estoque
        </span>
      )}

      {isMoved && (
        <span className="text-xs text-amber-500 font-medium">
          Posição original: {product.sortOrder}
        </span>
      )}

      {!isReordering && (
        <div className="relative z-10 mt-auto flex items-center justify-between gap-3">
          <Toggle
            checked={product.isActive}
            onCheckedChange={onToggle}
            disabled={isPending}
          />

          <TrashButton disabled={isPending} onClick={onRemove} />
        </div>
      )}
    </div>
  );
};
