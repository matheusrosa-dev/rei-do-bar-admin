import { arrayMove } from "@dnd-kit/sortable";
import type { ICategoryGroupWithCategories } from "@shared/models";
import type { UpdateCategoryGroupsOrderBody } from "@shared/services/category-groups/types";

const GROUP_DROP_SUFFIX = "::drop";

export const buildGroupDropId = (groupId: string) =>
  `${groupId}${GROUP_DROP_SUFFIX}`;

export const resolveDropId = (id: string) =>
  id.endsWith(GROUP_DROP_SUFFIX) ? id.slice(0, -GROUP_DROP_SUFFIX.length) : id;

const treeSignature = (groups: ICategoryGroupWithCategories[]) =>
  groups
    .map(
      (group) =>
        `${group.id}:${group.categories.map((category) => category.id).join(",")}`,
    )
    .join("|");

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
  const newIndex = findGroupIndex(groups, resolveDropId(overId));

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

  const targetId = resolveDropId(overId);

  const targetGroup = groups.find(
    (group) =>
      group.id === targetId ||
      group.categories.some((category) => category.id === targetId),
  );

  if (!targetGroup) return groups;

  const oldIndex = sourceGroup.categories.findIndex(
    (category) => category.id === activeId,
  );

  if (targetGroup.id === sourceGroup.id) {
    const newIndex = sourceGroup.categories.findIndex(
      (category) => category.id === targetId,
    );

    if (newIndex === -1) return groups;

    return groups.map((group) => {
      if (group.id !== sourceGroup.id) return group;

      return {
        ...group,
        categories: arrayMove(group.categories, oldIndex, newIndex),
      };
    });
  }

  const category = sourceGroup.categories[oldIndex];

  return groups.map((group) => {
    if (group.id === sourceGroup.id) {
      return {
        ...group,
        categories: group.categories.filter((item) => item.id !== activeId),
      };
    }

    if (group.id === targetGroup.id) {
      return { ...group, categories: [...group.categories, category] };
    }

    return group;
  });
};

export const isTreeDirty = (
  original: ICategoryGroupWithCategories[],
  draft: ICategoryGroupWithCategories[],
): boolean => treeSignature(original) !== treeSignature(draft);

export type CategoryOrigin = {
  groupId: string;
  groupName: string;
};

export const getCategoryOrigins = (
  original: ICategoryGroupWithCategories[],
): Record<string, CategoryOrigin> => {
  const origins: Record<string, CategoryOrigin> = {};

  for (const group of original) {
    for (const category of group.categories) {
      origins[category.id] = { groupId: group.id, groupName: group.name };
    }
  }

  return origins;
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
