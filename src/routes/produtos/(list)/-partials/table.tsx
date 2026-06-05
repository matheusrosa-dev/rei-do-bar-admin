import type { IProduct } from "@shared/models";
import {
  ImagePreview,
  StatusBadge,
  Table as TableComponent,
} from "@components";
import { formatPrice } from "@shared/helpers/number";
import type { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "@tanstack/react-router";
import type { IPagination } from "@shared/interfaces";
import { LuPencil } from "react-icons/lu";

type Props = {
  data: IProduct[];
  meta?: IPagination<unknown>["meta"];
  limit: number;
  isLoading?: boolean;
  isError?: boolean;
};

export const Table = ({ data, meta, limit, isLoading, isError }: Props) => {
  const navigate = useNavigate({ from: "/produtos/" });

  const productColumns: ColumnDef<IProduct>[] = [
    {
      accessorKey: "imageUrl",
      header: "Imagem",
      cell: ({ getValue }) => {
        const url = getValue<string>();
        return url ? (
          <ImagePreview
            src={url}
            alt="Produto"
            className="w-14 h-14 rounded-md object-contain bg-white/5"
          />
        ) : (
          <div className="w-14 h-14 rounded-md bg-white/10 flex items-center justify-center text-gray-600 text-xs">
            —
          </div>
        );
      },
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
    </div>
  );
};
