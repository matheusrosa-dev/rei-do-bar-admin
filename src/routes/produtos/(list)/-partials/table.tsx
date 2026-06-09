import type { IProductWithCategory } from "@shared/models";
import {
  ConfirmModal,
  ImagePreview,
  StatusBadge,
  Table as TableComponent,
  Toggle,
  TrashButton,
} from "@components";
import { formatPrice } from "@shared/helpers/number";
import type { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "@tanstack/react-router";
import type { IPagination } from "@shared/interfaces";
import { useProductsService } from "@services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";

type Props = {
  data: IProductWithCategory[];
  meta?: IPagination<unknown>["meta"];
  limit: number;
  isLoading?: boolean;
  isError?: boolean;
};

type ModalOpen =
  | { mode: "remove-product"; productId: string }
  | { mode: "toggle-status"; product: IProductWithCategory };

export const Table = ({ data, meta, limit, isLoading, isError }: Props) => {
  const [modalOpen, setModalOpen] = useState<ModalOpen | null>(null);

  const navigate = useNavigate({ from: "/produtos/" });
  const queryClient = useQueryClient();

  const { removeProduct, getProducts, activateProduct, deactivateProduct } =
    useProductsService();

  const removeProductMutation = useMutation({
    mutationFn: removeProduct,
    onSuccess: () => {
      toast.success("Produto removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: [getProducts.key] });
      setModalOpen(null);
    },
  });

  const toggleProductMutation = useMutation({
    mutationFn: (product: IProductWithCategory) => {
      if (product.isActive) {
        return deactivateProduct(product.id);
      }
      return activateProduct(product.id);
    },
    onSuccess: (updatedProduct) => {
      toast.success(
        `Produto ${updatedProduct.isActive ? "ativado" : "desativado"} com sucesso!`,
      );
      queryClient.invalidateQueries({ queryKey: [getProducts.key] });
      setModalOpen(null);
    },
  });

  const productColumns: ColumnDef<IProductWithCategory>[] = [
    {
      accessorKey: "imageUrl",
      header: "Imagem",
      cell: ({ getValue }) => (
        <ImagePreview
          src={getValue<string>()}
          alt="Produto"
          className="w-14 h-14"
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Nome",
    },
    {
      accessorKey: "price",
      header: "Preço",
      cell: ({ getValue }) => formatPrice(getValue<number>()),
    },
    {
      accessorKey: "category",
      header: "Categoria",
      cell: ({ getValue }) => getValue<IProductWithCategory>()?.name,
    },
    {
      accessorKey: "stock",
      header: "Estoque",
      cell: ({ getValue }) => {
        const stock = getValue<number>();
        return stock === 0 ? (
          <StatusBadge variant="alert">Esgotado</StatusBadge>
        ) : (
          stock
        );
      },
    },
    {
      accessorKey: "sortOrder",
      header: "Destaque",
      cell: ({ getValue }) => {
        const sortOrder = getValue<number>();
        return sortOrder || "-";
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <span onClick={(e) => e.stopPropagation()} className="flex w-fit">
            <Toggle
              checked={product.isActive}
              onCheckedChange={() =>
                setModalOpen({ mode: "toggle-status", product })
              }
              disabled={toggleProductMutation.isPending}
            />
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <TrashButton
          onClick={() =>
            setModalOpen({
              mode: "remove-product",
              productId: row.original.id,
            })
          }
        />
      ),
    },
  ];

  const setPage = (page: number) => {
    navigate({
      search: (prev) => ({ ...prev, page: page > 1 ? page : undefined }),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <span
        className={`text-sm text-gray-400 ${meta ? "opacity-100" : "opacity-0"}`}
      >
        {meta?.total} produto{meta?.total !== 1 ? "s" : ""} no total
      </span>

      <TableComponent
        data={data}
        columns={productColumns}
        isLoading={isLoading}
        isError={isError}
        limit={limit}
        onRowClick={(row) =>
          navigate({
            to: "/produtos/editar/$productId",
            params: { productId: row.id },
          })
        }
      />

      {meta?.totalPages && (
        <TableComponent.Pagination meta={meta} onChangePage={setPage} />
      )}

      <ConfirmModal
        isOpen={modalOpen?.mode === "remove-product"}
        title="Tem certeza que deseja remover este produto?"
        onClose={() => setModalOpen(null)}
        variant="danger"
        canClose={!removeProductMutation.isPending}
        confirmLabel="Remover produto"
        description="Essa ação não poderá ser desfeita."
        onConfirm={() => {
          if (modalOpen?.mode === "remove-product") {
            removeProductMutation.mutate(modalOpen.productId);
          }
        }}
      />

      <ConfirmModal
        isOpen={modalOpen?.mode === "toggle-status"}
        title={
          modalOpen?.mode === "toggle-status" && modalOpen.product.isActive
            ? "Desativar produto?"
            : "Ativar produto?"
        }
        description={
          modalOpen?.mode === "toggle-status" && modalOpen.product.isActive
            ? "O produto ficará indisponível para novos pedidos."
            : "O produto voltará a ficar disponível para novos pedidos."
        }
        onClose={() => setModalOpen(null)}
        variant={
          modalOpen?.mode === "toggle-status" && modalOpen.product.isActive
            ? "danger"
            : "default"
        }
        canClose={!toggleProductMutation.isPending}
        confirmLabel={
          modalOpen?.mode === "toggle-status" && modalOpen.product.isActive
            ? "Desativar"
            : "Ativar"
        }
        onConfirm={() => {
          if (modalOpen?.mode === "toggle-status") {
            toggleProductMutation.mutate(modalOpen.product);
          }
        }}
      />
    </div>
  );
};
