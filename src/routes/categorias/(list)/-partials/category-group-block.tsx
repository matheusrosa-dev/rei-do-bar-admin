import { useDndContext, useDroppable } from "@dnd-kit/core";
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
import type { CategoryOrigin } from "../-helpers";
import { buildGroupDropId, resolveDropId } from "../-helpers";
import { MdDragIndicator } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { AddCategoryCard } from "./add-category-card";
import { SortableCategoryCard } from "./sortable-category-card";

type Props = {
  group: ICategoryGroupWithCategories;
  isReordering: boolean;
  isPending: boolean;
  pendingCategoryId: string | null;
  categoryOrigins: Record<string, CategoryOrigin>;
  onToggleGroup: () => void;
  onRemoveGroup: () => void;
  onToggleCategory: (category: ICategoryWithProductsCount) => void;
  onRemoveCategory: (category: ICategoryWithProductsCount) => void;
};

export const CategoryGroupBlock = ({
  group,
  isReordering,
  isPending,
  pendingCategoryId,
  categoryOrigins,
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

  const { setNodeRef: setDropZoneRef } = useDroppable({
    id: buildGroupDropId(group.id),
    disabled: !isReordering,
  });

  const { active, over } = useDndContext();

  const holdsCategory = (id: string | null) =>
    id !== null && group.categories.some((category) => category.id === id);

  const isCategoryDrag = active?.data.current?.type === "category";
  const isCategorySource = isCategoryDrag && holdsCategory(String(active.id));

  const overId = over ? resolveDropId(String(over.id)) : null;
  const isOverGroup = overId === group.id || holdsCategory(overId);

  const isDropTarget = isCategoryDrag && !isCategorySource && isOverGroup;

  const dropPlaceholderLabel = hasCategories
    ? "Solte aqui para mover para este grupo"
    : "Solte uma categoria aqui";

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragProps = isReordering ? { ...attributes, ...listeners } : {};

  const getOriginGroupName = (categoryId: string) => {
    const origin = categoryOrigins[categoryId];

    if (!origin || origin.groupId === group.id) return null;

    return origin.groupName;
  };

  return (
    <Wrapper
      ref={setNodeRef}
      style={style}
      className={twMerge(
        "flex flex-col gap-4 transition-colors duration-150",
        isDropTarget && "border-amber-500/40 bg-amber-500/5",
        isDragging && "opacity-50 border-amber-500/10 bg-amber-500/5",
      )}
    >
      <div
        {...dragProps}
        className={twMerge(
          "flex flex-wrap items-center justify-between gap-3",
          isReordering &&
            "select-none cursor-grab active:cursor-grabbing focus:outline-none focus:ring-1 focus:ring-amber-500 rounded-lg",
        )}
      >
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-white text-lg font-bold">{group.name}</h2>

          {isReordering && (
            <MdDragIndicator size={18} className="shrink-0 text-zinc-500" />
          )}
        </div>

        {!isReordering && (
          <div className="flex items-center gap-3">
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
              originGroupName={getOriginGroupName(category.id)}
              onToggle={() => onToggleCategory(category)}
              onRemove={() => onRemoveCategory(category)}
            />
          ))}
        </SortableContext>

        {!isReordering && <AddCategoryCard groupId={group.id} />}

        {isReordering && (
          <div
            ref={setDropZoneRef}
            className={twMerge(
              "col-span-full flex items-center justify-center p-8 rounded-lg border border-dashed border-white/10 text-gray-400 text-sm transition-colors duration-150",
              isDropTarget && "border-amber-500/40 text-amber-500",
            )}
          >
            {dropPlaceholderLabel}
          </div>
        )}
      </div>
    </Wrapper>
  );
};
