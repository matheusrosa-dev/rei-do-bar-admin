import { ImagePreview, Toggle, Tooltip, TrashButton } from "@components";
import type { ICategoryWithProductsCount } from "@shared/models";
import { Link } from "@tanstack/react-router";

type Props = {
  category: ICategoryWithProductsCount;
  isPending: boolean;
  onToggle: () => void;
  onRemove: () => void;
};

export const CategoryCard = ({
  category,
  isPending,
  onToggle,
  onRemove,
}: Props) => {
  const hasProducts = category.productsCount > 0;

  return (
    <div className="relative p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors duration-150 flex flex-col gap-4 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500">
      <div className="flex items-start gap-3">
        <span className="relative z-10">
          <ImagePreview src={category.imageUrl} className="w-14 h-14" />
        </span>

        <div className="flex flex-col gap-0.5 min-w-0">
          <Link
            to="/categorias/editar/$categoryId"
            params={{ categoryId: category.id }}
            className="text-white text-sm font-medium break-words focus:outline-none after:absolute after:inset-0 after:cursor-pointer"
          >
            {category.name}
          </Link>

          <span className="text-xs text-gray-400 break-words">
            {category.pluralName}
          </span>
        </div>
      </div>

      <span className="text-sm text-gray-400">
        {category.productsCount} produto
        {category.productsCount !== 1 ? "s" : ""}
      </span>

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
    </div>
  );
};
