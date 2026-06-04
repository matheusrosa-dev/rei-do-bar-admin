import type { IProduct } from "@shared/models";
import { ImagePreview, Table as TableComponent } from "@components";
import { formatPrice } from "@shared/helpers/number";
import type { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "@tanstack/react-router";
import type { IPagination } from "@shared/interfaces";

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
        <span className="select-none inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/15 text-orange-400">
          Esgotado
        </span>
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
        <span
          className={`select-none inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            active
              ? "bg-green-500/15 text-green-400"
              : "bg-red-500/15 text-red-400"
          }`}
        >
          {active ? "Ativo" : "Inativo"}
        </span>
      );
    },
  },
];

type Props = {
  data: IProduct[];
  meta?: IPagination<unknown>["meta"];
  limit: number;
  isLoading?: boolean;
  isError?: boolean;
};

export const Table = ({ data, meta, limit, isLoading, isError }: Props) => {
  const navigate = useNavigate({ from: "/products/" });

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
