import {
  ConfirmModal,
  ImagePreview,
  Table as TableComponent,
  Toggle,
  Tooltip,
  TrashButton,
} from "@components";
import type { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "@tanstack/react-router";
import { useCategoriesService } from "@services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import type { CategoryWithProductsCount } from "../-types";

type Props = {
  data: CategoryWithProductsCount[];
  isLoading?: boolean;
  isError?: boolean;
};

type ModalOpen =
  | { mode: "remove-category"; categoryId: string }
  | { mode: "toggle-status"; category: CategoryWithProductsCount };

export const Table = ({ data, isLoading, isError }: Props) => {
  const [modalOpen, setModalOpen] = useState<ModalOpen | null>(null);

  const navigate = useNavigate({ from: "/categorias/" });
  const queryClient = useQueryClient();

  const {
    removeCategory,
    getCategories,
    activateCategory,
    deactivateCategory,
  } = useCategoriesService();

  const removeCategoryMutation = useMutation({
    mutationFn: removeCategory,
    onSuccess: () => {
      toast.success("Categoria removida com sucesso!");
      queryClient.invalidateQueries({ queryKey: [getCategories.key] });
      setModalOpen(null);
    },
  });

  const toggleCategoryMutation = useMutation({
    mutationFn: (category: CategoryWithProductsCount) => {
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

  const categoryColumns: ColumnDef<CategoryWithProductsCount>[] = [
    {
      accessorKey: "imageUrl",
      header: "Imagem",
      cell: ({ getValue }) => (
        <ImagePreview src={getValue<string>()} className="w-14 h-14" />
      ),
    },
    {
      accessorKey: "name",
      header: "Nome",
    },
    {
      accessorKey: "pluralName",
      header: "Nome plural",
    },

    {
      accessorKey: "productsCount",
      header: "Qtd. de produtos",
      cell: ({ row }) => (
        <span className="ml-12">{row.original.productsCount}</span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const category = row.original;

        return (
          <span onClick={(e) => e.stopPropagation()} className="flex w-fit">
            <Toggle
              checked={category.isActive}
              onCheckedChange={() =>
                setModalOpen({ mode: "toggle-status", category })
              }
              disabled={toggleCategoryMutation.isPending}
            />
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const { productsCount, id } = row.original;
        const hasProducts = productsCount > 0;

        return (
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
                disabled={hasProducts}
                onClick={() =>
                  setModalOpen({ mode: "remove-category", categoryId: id })
                }
              />
            </span>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <span
        className={`text-sm text-gray-400 ${data.length > 0 || !isLoading ? "opacity-100" : "opacity-0"}`}
      >
        {data.length} categoria{data.length !== 1 ? "s" : ""} no total
      </span>

      <TableComponent
        data={data}
        columns={categoryColumns}
        isLoading={isLoading}
        isError={isError}
        limit={data.length || 5}
        onRowClick={(row) =>
          navigate({
            to: "/categorias/editar/$categoryId",
            params: { categoryId: row.id },
          })
        }
      />

      <ConfirmModal
        isOpen={modalOpen?.mode === "remove-category"}
        title="Tem certeza que deseja remover esta categoria?"
        onClose={() => setModalOpen(null)}
        variant="danger"
        canClose={!removeCategoryMutation.isPending}
        confirmLabel="Remover categoria"
        description="Essa ação não poderá ser desfeita."
        onConfirm={() => {
          if (modalOpen?.mode === "remove-category") {
            removeCategoryMutation.mutate(modalOpen.categoryId);
          }
        }}
      />

      <ConfirmModal
        isOpen={modalOpen?.mode === "toggle-status"}
        title={
          modalOpen?.mode === "toggle-status" && modalOpen.category.isActive
            ? "Desativar categoria?"
            : "Ativar categoria?"
        }
        description={
          modalOpen?.mode === "toggle-status" && modalOpen.category.isActive
            ? "A categoria ficará indisponível para seleção de produtos e todos os produtos vinculados serão automaticamente desativados."
            : "A categoria voltará a ficar disponível para seleção de produtos."
        }
        onClose={() => setModalOpen(null)}
        variant={
          modalOpen?.mode === "toggle-status" && modalOpen.category.isActive
            ? "danger"
            : "default"
        }
        canClose={!toggleCategoryMutation.isPending}
        confirmLabel={
          modalOpen?.mode === "toggle-status" && modalOpen.category.isActive
            ? "Desativar"
            : "Ativar"
        }
        onConfirm={() => {
          if (modalOpen?.mode === "toggle-status") {
            toggleCategoryMutation.mutate(modalOpen.category);
          }
        }}
      />
    </div>
  );
};
