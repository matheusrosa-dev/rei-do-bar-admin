import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useCategoriesService, useCategoryGroupsService } from "@services";
import type { ICategoryGroupWithCategories } from "@shared/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  buildSortOrderBody,
  getDirtyGroupIds,
  isTreeDirty,
  moveCategory,
  moveGroup,
  resetGroupOrder,
} from "./reorder";

export const useCategoriesReorder = (
  groups: ICategoryGroupWithCategories[],
) => {
  const [draft, setDraft] = useState<ICategoryGroupWithCategories[] | null>(
    null,
  );

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { getCategories } = useCategoriesService();
  const { getCategoryGroups, updateCategoryGroupsOrder } =
    useCategoryGroupsService();

  const saveMutation = useMutation({
    mutationFn: (tree: ICategoryGroupWithCategories[]) =>
      updateCategoryGroupsOrder(buildSortOrderBody(tree)),
    onSuccess: () => {
      toast.success("Ordenação salva com sucesso!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [getCategoryGroups.key] });
      queryClient.invalidateQueries({ queryKey: [getCategories.key] });
      setDraft(null);
    },
  });

  const onDragStart = ({ active }: DragStartEvent) => {
    if (active.data.current?.type !== "category") return;

    setActiveCategoryId(String(active.id));
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveCategoryId(null);

    if (saveMutation.isPending || !over || active.id === over.id) return;

    const isGroup = active.data.current?.type === "group";

    setDraft((current) => {
      if (!current) return current;

      if (isGroup) {
        return moveGroup(current, String(active.id), String(over.id));
      }

      return moveCategory(current, String(active.id), String(over.id));
    });
  };

  const save = () => {
    if (!draft) return;

    saveMutation.mutate(draft);
  };

  const resetGroup = (groupId: string) => {
    setDraft((current) => {
      if (!current) return current;

      return resetGroupOrder(groups, current, groupId);
    });
  };

  return {
    groups: draft ?? groups,
    dirtyGroupIds: draft ? getDirtyGroupIds(groups, draft) : [],
    isReordering: draft !== null,
    isDirty: draft !== null && isTreeDirty(groups, draft),
    isSaving: saveMutation.isPending,
    activeCategoryId,
    start: () => setDraft(groups),
    cancel: () => setDraft(null),
    resetGroup,
    save,
    onDragStart,
    onDragEnd,
    onDragCancel: () => setActiveCategoryId(null),
  };
};
