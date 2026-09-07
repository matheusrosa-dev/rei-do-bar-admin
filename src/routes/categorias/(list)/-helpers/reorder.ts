import { arrayMove } from "@dnd-kit/sortable";
import type { ICategoryGroupWithCategories } from "@shared/models";

const categoryOrder = (group: ICategoryGroupWithCategories) =>
  group.categories.map((category) => category.id).join(",");

export const moveCategory = (
  groups: ICategoryGroupWithCategories[],
  activeId: string,
  overId: string,
): ICategoryGroupWithCategories[] => {
  const sourceGroup = groups.find((group) =>
    group.categories.some((category) => category.id === activeId),
  );

  if (!sourceGroup) return groups;

  const oldIndex = sourceGroup.categories.findIndex(
    (category) => category.id === activeId,
  );

  const newIndex = sourceGroup.categories.findIndex(
    (category) => category.id === overId,
  );

  if (newIndex === -1) return groups;

  return groups.map((group) => {
    if (group.id !== sourceGroup.id) return group;

    return {
      ...group,
      categories: arrayMove(group.categories, oldIndex, newIndex),
    };
  });
};

export const resetGroupOrder = (
  original: ICategoryGroupWithCategories[],
  draft: ICategoryGroupWithCategories[],
  groupId: string,
): ICategoryGroupWithCategories[] => {
  const originalGroup = original.find((group) => group.id === groupId);

  if (!originalGroup) return draft;

  return draft.map((group) => (group.id === groupId ? originalGroup : group));
};

export const getDirtyGroupIds = (
  original: ICategoryGroupWithCategories[],
  draft: ICategoryGroupWithCategories[],
): string[] => {
  return draft
    .filter((group) => {
      const originalGroup = original.find((item) => item.id === group.id);

      if (!originalGroup) return false;

      return categoryOrder(originalGroup) !== categoryOrder(group);
    })
    .map((group) => group.id);
};
