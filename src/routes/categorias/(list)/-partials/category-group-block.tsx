import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Toggle, Tooltip, TrashButton, Wrapper } from "@components";
import type {
  ICategoryGroupWithCategories,
  ICategoryWithProductsCount,
} from "@shared/models";
import { FiRotateCcw } from "react-icons/fi";
import { AddCategoryCard } from "./add-category-card";
import { CategoryCard } from "./category-card";

type Props = {
  group: ICategoryGroupWithCategories;
  isReordering: boolean;
  isDirty: boolean;
  isPending: boolean;
  pendingCategoryId: string | null;
  onToggleGroup: () => void;
  onRemoveGroup: () => void;
  onToggleCategory: (category: ICategoryWithProductsCount) => void;
  onRemoveCategory: (category: ICategoryWithProductsCount) => void;
  onResetGroup: () => void;
};

export const CategoryGroupBlock = ({
  group,
  isReordering,
  isDirty,
  isPending,
  pendingCategoryId,
  onToggleGroup,
  onRemoveGroup,
  onToggleCategory,
  onRemoveCategory,
  onResetGroup,
}: Props) => {
  const hasCategories = group.categories.length > 0;

  return (
    <Wrapper className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-white text-lg font-bold">{group.name}</h2>
        </div>

        {isReordering ? (
          isDirty && (
            <button
              type="button"
              onClick={onResetGroup}
              className="select-none flex items-center gap-1.5 px-3 py-2.5 text-sm text-amber-500 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <FiRotateCcw className="size-4" />
              Resetar ordenação
            </button>
          )
        ) : (
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
            <CategoryCard
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

        {!isReordering && <AddCategoryCard groupId={group.id} />}
      </div>
    </Wrapper>
  );
};
