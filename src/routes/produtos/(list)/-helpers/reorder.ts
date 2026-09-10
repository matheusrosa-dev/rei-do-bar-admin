import { arrayMove } from "@dnd-kit/sortable";
import type { ICategoryGroupWithProducts } from "@shared/models";
import type { UpdateProductsOrderBody } from "@shared/services/products/types";

const groupSignature = (group: ICategoryGroupWithProducts) =>
  group.products.map((product) => product.id).join(",");

const treeSignature = (groups: ICategoryGroupWithProducts[]) =>
  groups.map((group) => `${group.id}:${groupSignature(group)}`).join("|");

export const moveProduct = (
  groups: ICategoryGroupWithProducts[],
  activeId: string,
  overId: string,
): ICategoryGroupWithProducts[] => {
  const sourceGroup = groups.find((group) =>
    group.products.some((product) => product.id === activeId),
  );

  if (!sourceGroup) return groups;

  const oldIndex = sourceGroup.products.findIndex(
    (product) => product.id === activeId,
  );

  const newIndex = sourceGroup.products.findIndex(
    (product) => product.id === overId,
  );

  if (newIndex === -1 || oldIndex === newIndex) return groups;

  return groups.map((group) => {
    if (group.id !== sourceGroup.id) return group;

    return {
      ...group,
      products: arrayMove(group.products, oldIndex, newIndex),
    };
  });
};

export const isTreeDirty = (
  original: ICategoryGroupWithProducts[],
  draft: ICategoryGroupWithProducts[],
): boolean => treeSignature(original) !== treeSignature(draft);

export const getDirtyGroupIds = (
  original: ICategoryGroupWithProducts[],
  draft: ICategoryGroupWithProducts[],
): string[] =>
  draft
    .filter((group) => {
      const originalGroup = original.find((item) => item.id === group.id);

      if (!originalGroup) return false;

      return groupSignature(originalGroup) !== groupSignature(group);
    })
    .map((group) => group.id);

export const resetGroupOrder = (
  original: ICategoryGroupWithProducts[],
  draft: ICategoryGroupWithProducts[],
  groupId: string,
): ICategoryGroupWithProducts[] => {
  const originalGroup = original.find((group) => group.id === groupId);

  if (!originalGroup) return draft;

  return draft.map((group) => {
    if (group.id !== groupId) return group;

    return { ...group, products: originalGroup.products };
  });
};

export const buildSortOrderBody = (
  draft: ICategoryGroupWithProducts[],
): UpdateProductsOrderBody => ({
  categoryGroups: draft.map((group) => ({
    categoryGroupId: group.id,
    products: group.products.map((product) => ({ productId: product.id })),
  })),
});
