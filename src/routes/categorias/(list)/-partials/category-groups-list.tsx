import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { useCategoriesService, useCategoryGroupsService } from "@services";
import type {
  ICategoryGroupWithCategories,
  ICategoryWithProductsCount,
} from "@shared/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { MdDragIndicator } from "react-icons/md";
import { toast } from "sonner";
import { AddGroupCard } from "./add-group-card";
import { CategoryGroupBlock } from "./category-group-block";
import { CategoryRemoveModal } from "./category-remove-modal";
import { CategoryStatusModal } from "./category-status-modal";
import { GroupModal } from "./group-modal";
import { GroupRemoveModal } from "./group-remove-modal";
import { GroupStatusModal } from "./group-status-modal";

type Props = {
  groups: ICategoryGroupWithCategories[];
  isReordering: boolean;
  dirtyGroupIds: string[];
  onDragEnd: (event: DragEndEvent) => void;
  onResetGroup: (groupId: string) => void;
};

type ModalOpen =
  | { mode: "remove-category"; category: ICategoryWithProductsCount }
  | { mode: "toggle-category-status"; category: ICategoryWithProductsCount }
  | { mode: "remove-group"; group: ICategoryGroupWithCategories }
  | { mode: "toggle-group-status"; group: ICategoryGroupWithCategories }
  | { mode: "create-group" };

export const CategoryGroupsList = ({
  groups,
  isReordering,
  dirtyGroupIds,
  onDragEnd,
  onResetGroup,
}: Props) => {
  const [modalOpen, setModalOpen] = useState<ModalOpen | null>(null);
  const [categoryStatusMode, setCategoryStatusMode] = useState<
    "activate" | "deactivate"
  >("activate");
  const [groupStatusMode, setGroupStatusMode] = useState<
    "activate" | "deactivate"
  >("activate");

  const queryClient = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const {
    removeCategory,
    getCategories,
    activateCategory,
    deactivateCategory,
  } = useCategoriesService();
  const {
    getCategoryGroups,
    activateCategoryGroup,
    deactivateCategoryGroup,
    removeCategoryGroup,
  } = useCategoryGroupsService();

  const invalidateCategoryGroups = () => {
    queryClient.invalidateQueries({ queryKey: [getCategoryGroups.key] });
  };

  const invalidateCategories = () => {
    invalidateCategoryGroups();
    queryClient.invalidateQueries({ queryKey: [getCategories.key] });
  };

  const removeCategoryMutation = useMutation({
    mutationFn: removeCategory,
    onSuccess: () => {
      toast.success("Categoria removida com sucesso!");
      invalidateCategories();
      setModalOpen(null);
    },
  });

  const toggleCategoryMutation = useMutation({
    mutationFn: (category: ICategoryWithProductsCount) => {
      if (category.isActive) {
        return deactivateCategory(category.id);
      }

      return activateCategory(category.id);
    },
    onSuccess: () => {
      toast.success(
        `Categoria ${categoryStatusMode === "activate" ? "ativada" : "desativada"} com sucesso!`,
      );
      invalidateCategories();
      setModalOpen(null);
    },
  });

  const removeGroupMutation = useMutation({
    mutationFn: removeCategoryGroup,
    onSuccess: () => {
      toast.success("Grupo removido com sucesso!");
      invalidateCategoryGroups();
      setModalOpen(null);
    },
  });

  const toggleGroupMutation = useMutation({
    mutationFn: (group: ICategoryGroupWithCategories) => {
      if (group.isActive) {
        return deactivateCategoryGroup(group.id);
      }

      return activateCategoryGroup(group.id);
    },
    onSuccess: () => {
      toast.success(
        `Grupo ${groupStatusMode === "activate" ? "ativado" : "desativado"} com sucesso!`,
      );
      invalidateCategoryGroups();
      setModalOpen(null);
    },
  });

  const isCategoryPending =
    removeCategoryMutation.isPending || toggleCategoryMutation.isPending;

  const isGroupPending =
    removeGroupMutation.isPending || toggleGroupMutation.isPending;

  const getPendingCategoryId = () => {
    if (!isCategoryPending || !modalOpen) return null;

    if (
      modalOpen.mode === "remove-category" ||
      modalOpen.mode === "toggle-category-status"
    ) {
      return modalOpen.category.id;
    }

    return null;
  };

  const getPendingGroupId = () => {
    if (!isGroupPending || !modalOpen) return null;

    if (
      modalOpen.mode === "remove-group" ||
      modalOpen.mode === "toggle-group-status"
    ) {
      return modalOpen.group.id;
    }

    return null;
  };

  const pendingCategoryId = getPendingCategoryId();
  const pendingGroupId = getPendingGroupId();

  const onToggleCategory = (category: ICategoryWithProductsCount) => {
    setCategoryStatusMode(category.isActive ? "deactivate" : "activate");
    setModalOpen({ mode: "toggle-category-status", category });
  };

  const onToggleGroup = (group: ICategoryGroupWithCategories) => {
    setGroupStatusMode(group.isActive ? "deactivate" : "activate");
    setModalOpen({ mode: "toggle-group-status", group });
  };

  const groupModal = (
    <GroupModal
      isOpen={modalOpen?.mode === "create-group"}
      onClose={() => setModalOpen(null)}
    />
  );

  const addGroupCard = (
    <AddGroupCard onClick={() => setModalOpen({ mode: "create-group" })} />
  );

  const reorderBanner = (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3">
      <MdDragIndicator size={18} className="shrink-0 text-amber-500" />

      <span className="text-sm font-medium text-amber-500">
        Modo de reordenação ativo
      </span>

      <span className="text-sm text-gray-400">
        Arraste as categorias dentro de cada grupo e salve para aplicar a nova
        ordem.
      </span>
    </div>
  );

  if (groups.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <span className="text-sm text-gray-400">
          Nenhum grupo de categorias cadastrado.
        </span>

        {addGroupCard}

        {groupModal}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {isReordering && reorderBanner}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <div className="flex flex-col gap-6">
          {groups.map((group) => (
            <CategoryGroupBlock
              key={group.id}
              group={group}
              isReordering={isReordering}
              isDirty={dirtyGroupIds.includes(group.id)}
              isPending={pendingGroupId === group.id}
              pendingCategoryId={pendingCategoryId}
              onToggleGroup={() => onToggleGroup(group)}
              onRemoveGroup={() =>
                setModalOpen({ mode: "remove-group", group })
              }
              onToggleCategory={onToggleCategory}
              onRemoveCategory={(category) =>
                setModalOpen({ mode: "remove-category", category })
              }
              onResetGroup={() => onResetGroup(group.id)}
            />
          ))}
        </div>
      </DndContext>

      {!isReordering && addGroupCard}

      {groupModal}

      <CategoryRemoveModal
        isOpen={modalOpen?.mode === "remove-category"}
        canClose={!removeCategoryMutation.isPending}
        onClose={() => setModalOpen(null)}
        onConfirm={() => {
          if (modalOpen?.mode === "remove-category") {
            removeCategoryMutation.mutate(modalOpen.category.id);
          }
        }}
      />

      <CategoryStatusModal
        isOpen={modalOpen?.mode === "toggle-category-status"}
        mode={categoryStatusMode}
        canClose={!toggleCategoryMutation.isPending}
        onClose={() => setModalOpen(null)}
        onConfirm={() => {
          if (modalOpen?.mode === "toggle-category-status") {
            toggleCategoryMutation.mutate(modalOpen.category);
          }
        }}
      />

      <GroupRemoveModal
        isOpen={modalOpen?.mode === "remove-group"}
        canClose={!removeGroupMutation.isPending}
        onClose={() => setModalOpen(null)}
        onConfirm={() => {
          if (modalOpen?.mode === "remove-group") {
            removeGroupMutation.mutate(modalOpen.group.id);
          }
        }}
      />

      <GroupStatusModal
        isOpen={modalOpen?.mode === "toggle-group-status"}
        mode={groupStatusMode}
        canClose={!toggleGroupMutation.isPending}
        onClose={() => setModalOpen(null)}
        onConfirm={() => {
          if (modalOpen?.mode === "toggle-group-status") {
            toggleGroupMutation.mutate(modalOpen.group);
          }
        }}
      />
    </div>
  );
};
