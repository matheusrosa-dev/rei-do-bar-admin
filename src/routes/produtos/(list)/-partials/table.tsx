import type { IProduct } from "@shared/models";
import {
  ConfirmModal,
  ImagePreview,
  StatusBadge,
  Table as TableComponent,
} from "@components";
import { formatPrice } from "@shared/helpers/number";
import type { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "@tanstack/react-router";
import type { IPagination } from "@shared/interfaces";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { useProductsService } from "@services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";

type Props = {
  data: IProduct[];
  meta?: IPagination<unknown>["meta"];
  limit: number;
  isLoading?: boolean;
  isError?: boolean;
};

type ModalOpen = {
  mode: "remove-product";
  productId: string;
};

export const Table = ({ data, meta, limit, isLoading, isError }: Props) => {
  const [modalOpen, setModalOpen] = useState<ModalOpen | null>(null);

  const navigate = useNavigate({ from: "/produtos/" });
  const queryClient = useQueryClient();

  const { removeProduct, getProducts } = useProductsService();

  const removeProductMutation = useMutation({
    mutationFn: removeProduct,
    onSuccess: () => {
      toast.success("Produto removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: [getProducts.key] });
      setModalOpen(null);
    },
    onError: () => toast.error("Ocorreu um erro ao tentar remover o produto."),
  });

  const productColumns: ColumnDef<IProduct>[] = [
    {
      accessorKey: "imageUrl",
      header: "Imagem",
      cell: ({ getValue }) => (
        <ImagePreview
          src={getValue<string>()}
          alt="Produto"
          className="w-14 h-14 rounded-md object-contain bg-white/5"
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
      cell: ({ getValue }) => {
        const active = getValue<boolean>();
        return (
          <StatusBadge variant={active ? "active" : "inactive"}>
            {active ? "Ativo" : "Inativo"}
          </StatusBadge>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div>
          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/produtos/editar/$productId",
                params: { productId: row.original.id },
              })
            }
            className="cursor-pointer p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Editar produto"
          >
            <LuPencil size={16} />
          </button>

          <button
            type="button"
            onClick={() =>
              setModalOpen({
                mode: "remove-product",
                productId: row.original.id,
              })
            }
            className="cursor-pointer p-2 rounded-md text-red-500 hover:bg-red-500/10 transition-colors"
            title="Editar produto"
          >
            <LuTrash2 size={16} />
          </button>
        </div>
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
          if (modalOpen) {
            removeProductMutation.mutate(modalOpen.productId);
          }
        }}
      />
    </div>
  );
};
