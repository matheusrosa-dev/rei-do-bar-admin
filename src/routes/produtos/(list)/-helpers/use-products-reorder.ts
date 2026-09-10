import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useProductsService } from "@services";
import type { ICategoryGroupWithProducts } from "@shared/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  buildSortOrderBody,
  getDirtyGroupIds,
  isTreeDirty,
  moveProduct,
  resetGroupOrder,
} from "./reorder";

export const useProductsReorder = (groups: ICategoryGroupWithProducts[]) => {
  const [draft, setDraft] = useState<ICategoryGroupWithProducts[] | null>(null);

  const [activeProductId, setActiveProductId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { getProducts, getProductsSimple, updateProductsOrder } =
    useProductsService();

  const saveMutation = useMutation({
    mutationFn: (tree: ICategoryGroupWithProducts[]) =>
      updateProductsOrder(buildSortOrderBody(tree)),
    onSuccess: () => {
      toast.success("Ordenação salva com sucesso!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [getProducts.key] });
      queryClient.invalidateQueries({ queryKey: [getProductsSimple.key] });
      setDraft(null);
    },
  });

  const onDragStart = ({ active }: DragStartEvent) => {
    setActiveProductId(String(active.id));
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveProductId(null);

    if (saveMutation.isPending || !over || active.id === over.id) return;

    setDraft((current) => {
      if (!current) return current;

      return moveProduct(current, String(active.id), String(over.id));
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
    activeProductId,
    start: () => setDraft(groups),
    cancel: () => setDraft(null),
    resetGroup,
    save,
    onDragStart,
    onDragEnd,
    onDragCancel: () => setActiveProductId(null),
  };
};
