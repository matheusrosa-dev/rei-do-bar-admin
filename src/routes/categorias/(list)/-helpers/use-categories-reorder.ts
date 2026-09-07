import type { DragEndEvent } from "@dnd-kit/core";
import { useCategoriesService, useCategoryGroupsService } from "@services";
import type { ICategoryGroupWithCategories } from "@shared/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getDirtyGroupIds, moveCategory, resetGroupOrder } from "./reorder";

export const useCategoriesReorder = (
  groups: ICategoryGroupWithCategories[],
) => {
  const [draft, setDraft] = useState<ICategoryGroupWithCategories[] | null>(
    null,
  );

  const queryClient = useQueryClient();

  const { updateCategoriesOrder, getCategories } = useCategoriesService();
  const { getCategoryGroups } = useCategoryGroupsService();

  const dirtyGroupIds = draft ? getDirtyGroupIds(groups, draft) : [];

  const saveMutation = useMutation({
    mutationFn: async (dirtyGroups: ICategoryGroupWithCategories[]) => {
      for (const group of dirtyGroups) {
        await updateCategoriesOrder({
          categoryGroupId: group.id,
          orderedIds: group.categories.map((category) => category.id),
        });
      }
    },
    onSuccess: () => {
      toast.success("Categorias reordenadas com sucesso!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [getCategoryGroups.key] });
      queryClient.invalidateQueries({ queryKey: [getCategories.key] });
      setDraft(null);
    },
  });

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (saveMutation.isPending || !over || active.id === over.id) return;

    setDraft((current) => {
      if (!current) return current;

      return moveCategory(current, String(active.id), String(over.id));
    });
  };

  const resetGroup = (groupId: string) => {
    setDraft((current) => {
      if (!current) return current;

      return resetGroupOrder(groups, current, groupId);
    });
  };

  const save = () => {
    if (!draft) return;

    saveMutation.mutate(
      draft.filter((group) => dirtyGroupIds.includes(group.id)),
    );
  };

  return {
    groups: draft ?? groups,
    isReordering: draft !== null,
    isDirty: dirtyGroupIds.length > 0,
    dirtyGroupIds,
    isSaving: saveMutation.isPending,
    start: () => setDraft(groups),
    cancel: () => setDraft(null),
    save,
    resetGroup,
    onDragEnd,
  };
};
