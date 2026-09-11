import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Toggle, Tooltip, TrashButton, Wrapper } from "@components";
import type {
  ICategoryGroupWithCategories,
  ICategoryWithProductsCount,
} from "@shared/models";
import { Link } from "@tanstack/react-router";
import { MdDragIndicator, MdEdit, MdUndo } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { AddCategoryCard } from "./add-category-card";
import { SortableCategoryCard } from "./sortable-category-card";

type Props = {
  group: ICategoryGroupWithCategories;
  isReordering: boolean;
  isPending: boolean;
  isOrderDirty: boolean;
  pendingCategoryId: string | null;
  onResetOrder: () => void;
  onToggleGroup: () => void;
  onRemoveGroup: () => void;
  onToggleCategory: (category: ICategoryWithProductsCount) => void;
  onRemoveCategory: (category: ICategoryWithProductsCount) => void;
};

export const CategoryGroupBlock = ({
  group,
  isReordering,
  isPending,
  isOrderDirty,
  pendingCategoryId,
  onResetOrder,
  onToggleGroup,
  onRemoveGroup,
  onToggleCategory,
  onRemoveCategory,
}: Props) => {
  const hasCategories = group.categories.length > 0;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: group.id,
    data: { type: "group" },
    disabled: !isReordering,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragProps = isReordering ? { ...attributes, ...listeners } : {};

  return (
    <Wrapper
      ref={setNodeRef}
      style={style}
      className={twMerge(
        "flex flex-col gap-4 transition-colors duration-150",
        isDragging && "opacity-50 border-amber-500/10 bg-amber-500/5",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          {...dragProps}
          className={twMerge(
            "flex flex-wrap items-center gap-3",
            isReordering &&
              "select-none cursor-grab active:cursor-grabbing focus:outline-none focus:ring-1 focus:ring-amber-500 rounded-lg",
          )}
        >
          <h2 className="text-white text-lg font-bold">{group.name}</h2>

          {isReordering && (
            <MdDragIndicator size={18} className="shrink-0 text-zinc-500" />
          )}
        </div>

        {isReordering && isOrderDirty && (
          <button
            type="button"
            onClick={onResetOrder}
            className="select-none flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium text-amber-500 cursor-pointer transition-colors duration-150 hover:bg-amber-500/10 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <MdUndo className="size-4" />
            Resetar ordem
          </button>
        )}

        {!isReordering && (
          <div className="flex items-center gap-3">
            <Link
              to="/categorias/grupos/editar/$categoryGroupId"
              params={{ categoryGroupId: group.id }}
              title="Editar"
              className="p-2 rounded-md text-zinc-400 hover:text-amber-500 hover:bg-amber-500/10 transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <MdEdit className="size-5" />
            </Link>

            <Toggle
              checked={group.isActive}
              onCheckedChange={onToggleGroup}
              disabled={isPending}
            />

            <Tooltip
              disabled={!hasCategories}
              content={
                <>
                  Não é possível remover este grupo
                  <br /> pois ele possui categorias vinculadas.
                </>
              }
            >
              <span>
                <TrashButton
                  disabled={hasCategories || isPending}
                  onClick={onRemoveGroup}
                />
              </span>
            </Tooltip>
          </div>
        )}
      </div>

      <hr className="border-white/10" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <SortableContext
          disabled={!isReordering}
          items={group.categories.map((category) => category.id)}
          strategy={rectSortingStrategy}
        >
          {group.categories.map((category, index) => (
            <SortableCategoryCard
              key={category.id}
              category={category}
              position={index + 1}
              isReordering={isReordering}
              isPending={pendingCategoryId === category.id}
              onToggle={() => onToggleCategory(category)}
              onRemove={() => onRemoveCategory(category)}
            />
          ))}
        </SortableContext>

        {!isReordering && (
          <AddCategoryCard
            groupId={group.id}
            className={hasCategories ? undefined : "col-span-full"}
          />
        )}

        {isReordering && !hasCategories && (
          <div className="col-span-full flex items-center justify-center p-8 rounded-lg border border-dashed border-white/10 text-gray-400 text-sm">
            Nenhuma categoria neste grupo
          </div>
        )}
      </div>
    </Wrapper>
  );
};
