import {
  ConfirmModal,
  Toggle,
  Tooltip,
  TrashButton,
  Wrapper,
} from "@components";
import { useState } from "react";
import type { ICategory } from "@shared/models";
import { useCategoriesService } from "@services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

type ModalOpen = "toggle-status" | "remove";

type Props = {
  category: ICategory & { productsCount: number };
};

export const Actions = ({ category }: Props) => {
  const [modalOpen, setModalOpen] = useState<ModalOpen | null>(null);

  const {
    activateCategory,
    deactivateCategory,
    removeCategory,
    getCategories,
  } = useCategoriesService();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const toggleCategoryMutation = useMutation({
    mutationFn: () => {
      if (category.isActive) {
        return deactivateCategory(category.id);
      }

      return activateCategory(category.id);
    },
    onSuccess: (updatedCategory) => {
      toast.success(
        `Categoria ${updatedCategory.isActive ? "ativada" : "desativada"} com sucesso!`,
      );
      queryClient.invalidateQueries({ queryKey: [getCategories.key] });
      setModalOpen(null);
    },
  });

  const removeCategoryMutation = useMutation({
    mutationFn: () => removeCategory(category.id),
    onSuccess: () => {
      toast.success("Categoria removida com sucesso!");
      queryClient.invalidateQueries({ queryKey: [getCategories.key] });
      navigate({ to: "/categorias" });
    },
  });

  const hasProducts = category.productsCount > 0;

  return (
    <>
      <Wrapper className="flex flex-col gap-4 w-fit">
        <h2 className="text-white text-lg font-bold">Ações</h2>

        <hr className="border-white/10" />

        <div className="flex gap-12 items-center">
          <Toggle
            label="Status"
            checked={category.isActive}
            onCheckedChange={() => setModalOpen("toggle-status")}
            disabled={toggleCategoryMutation.isPending}
          />

          <Tooltip
            disabled={!hasProducts}
            content={
              <>
                Não é possível remover essa categoria
                <br /> pois ela possui produtos vinculados.
              </>
            }
          >
            <span>
              <TrashButton
                disabled={hasProducts || removeCategoryMutation.isPending}
                onClick={() => setModalOpen("remove")}
                className="w-10 h-10 mt-auto"
              />
            </span>
          </Tooltip>
        </div>
      </Wrapper>

      <ConfirmModal
        isOpen={modalOpen === "toggle-status"}
        title={category.isActive ? "Desativar categoria?" : "Ativar categoria?"}
        description={
          category.isActive
            ? "A categoria ficará indisponível para seleção de produtos e todos os produtos vinculados serão automaticamente desativados."
            : "A categoria voltará a ficar disponível para seleção de produtos."
        }
        onClose={() => setModalOpen(null)}
        variant={category.isActive ? "danger" : "default"}
        canClose={!toggleCategoryMutation.isPending}
        confirmLabel={category.isActive ? "Desativar" : "Ativar"}
        onConfirm={toggleCategoryMutation.mutate}
      />

      <ConfirmModal
        isOpen={modalOpen === "remove"}
        title="Tem certeza que deseja remover esta categoria?"
        description="Essa ação não poderá ser desfeita."
        onClose={() => setModalOpen(null)}
        variant="danger"
        canClose={!removeCategoryMutation.isPending}
        confirmLabel="Remover categoria"
        onConfirm={removeCategoryMutation.mutate}
      />
    </>
  );
};
