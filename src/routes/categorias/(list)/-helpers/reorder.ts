import { arrayMove } from "@dnd-kit/sortable";
import type { ICategoryGroupWithCategories } from "@shared/models";
import type { UpdateCategoryGroupsOrderBody } from "@shared/services/category-groups/types";

const groupSignature = (group: ICategoryGroupWithCategories) =>
  group.categories.map((category) => category.id).join(",");

const treeSignature = (groups: ICategoryGroupWithCategories[]) =>
  groups.map((group) => `${group.id}:${groupSignature(group)}`).join("|");

const findGroupIndex = (
  groups: ICategoryGroupWithCategories[],
  id: string,
): number =>
  groups.findIndex(
    (group) =>
      group.id === id ||
      group.categories.some((category) => category.id === id),
  );

export const moveGroup = (
  groups: ICategoryGroupWithCategories[],
  activeId: string,
  overId: string,
): ICategoryGroupWithCategories[] => {
  const oldIndex = findGroupIndex(groups, activeId);
  const newIndex = findGroupIndex(groups, overId);

  if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
    return groups;
  }

  return arrayMove(groups, oldIndex, newIndex);
};

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

  if (newIndex === -1 || oldIndex === newIndex) return groups;

  return groups.map((group) => {
    if (group.id !== sourceGroup.id) return group;

    return {
      ...group,
      categories: arrayMove(group.categories, oldIndex, newIndex),
    };
  });
};

export const isTreeDirty = (
  original: ICategoryGroupWithCategories[],
  draft: ICategoryGroupWithCategories[],
): boolean => treeSignature(original) !== treeSignature(draft);

export const getDirtyGroupIds = (
  original: ICategoryGroupWithCategories[],
  draft: ICategoryGroupWithCategories[],
): string[] =>
  draft
    .filter((group) => {
      const originalGroup = original.find((item) => item.id === group.id);

      if (!originalGroup) return false;

      return groupSignature(originalGroup) !== groupSignature(group);
    })
    .map((group) => group.id);

export const resetGroupOrder = (
  original: ICategoryGroupWithCategories[],
  draft: ICategoryGroupWithCategories[],
  groupId: string,
): ICategoryGroupWithCategories[] => {
  const originalGroup = original.find((group) => group.id === groupId);

  if (!originalGroup) return draft;

  return draft.map((group) => {
    if (group.id !== groupId) return group;

    return { ...group, categories: originalGroup.categories };
  });
};

export const buildSortOrderBody = (
  draft: ICategoryGroupWithCategories[],
): UpdateCategoryGroupsOrderBody => ({
  categoryGroups: draft.map((group) => ({
    categoryGroupId: group.id,
    categories: group.categories.map((category) => ({
      categoryId: category.id,
    })),
  })),
});
