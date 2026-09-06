import { Toggle, Tooltip, TrashButton, Wrapper } from "@components";
import type {
  ICategoryGroupWithCategories,
  ICategoryWithProductsCount,
} from "@shared/models";
import { AddCategoryCard } from "./add-category-card";
import { CategoryCard } from "./category-card";

type Props = {
  group: ICategoryGroupWithCategories;
  isPending: boolean;
  pendingCategoryId: string | null;
  onToggleGroup: () => void;
  onRemoveGroup: () => void;
  onToggleCategory: (category: ICategoryWithProductsCount) => void;
  onRemoveCategory: (category: ICategoryWithProductsCount) => void;
};

export const CategoryGroupBlock = ({
  group,
  isPending,
  pendingCategoryId,
  onToggleGroup,
  onRemoveGroup,
  onToggleCategory,
  onRemoveCategory,
}: Props) => {
  const hasCategories = group.categories.length > 0;

  return (
    <Wrapper className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-white text-lg font-bold">{group.name}</h2>
        </div>

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
      </div>

      <hr className="border-white/10" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {group.categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            isPending={pendingCategoryId === category.id}
            onToggle={() => onToggleCategory(category)}
            onRemove={() => onRemoveCategory(category)}
          />
        ))}

        <AddCategoryCard groupId={group.id} />
      </div>
    </Wrapper>
  );
};
