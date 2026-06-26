import { StatusBadge, Table as TableComponent } from "@components";
import { formatDateTime } from "@shared/helpers/string";
import type { IPagination } from "@shared/interfaces";
import type { IInventoryMovement } from "@shared/models";
import { Link, useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { RiExternalLinkLine } from "react-icons/ri";
import {
  MOVEMENT_ORIGIN_LABEL,
  MOVEMENT_ORIGIN_VARIANT,
  MOVEMENT_QUANTITY_CLASS,
  MOVEMENT_QUANTITY_SIGN,
} from "../-helpers";

type Props = {
  data: IInventoryMovement[];
  meta?: IPagination<unknown>["meta"];
  limit: number;
  isLoading?: boolean;
  isError?: boolean;
};

export const Table = ({ data, meta, limit, isLoading, isError }: Props) => {
  const navigate = useNavigate({ from: "/movimentacoes-estoque/" });

  const movementColumns: ColumnDef<IInventoryMovement>[] = [
    {
      accessorKey: "origin",
      header: "Origem",
      cell: ({ row }) => (
        <StatusBadge variant={MOVEMENT_ORIGIN_VARIANT[row.original.origin]}>
          {MOVEMENT_ORIGIN_LABEL[row.original.origin]}
        </StatusBadge>
      ),
    },
    {
      accessorKey: "order",
      header: "Pedido",
      cell: ({ row }) => (
        <Link
          className="text-gray-400 text-sm underline flex w-fit flex-nowrap items-center gap-1 duration-150 hover:text-white"
          to="/pedidos"
          search={{ searchTerm: String(row.original.order.orderNumber) }}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          #{row.original.order.orderNumber}
          <RiExternalLinkLine />
        </Link>
      ),
    },
    {
      id: "items",
      header: "Itens",
      cell: ({ row }) => {
        const variant = MOVEMENT_ORIGIN_VARIANT[row.original.origin];
        const invertedVariant = variant === "active" ? "inactive" : "active";

        const sign = MOVEMENT_QUANTITY_SIGN[invertedVariant];
        const { products } = row.original;

        return (
          <div
            className={`flex max-w-48 flex-col ${MOVEMENT_QUANTITY_CLASS[invertedVariant]}`}
          >
            {products.map((item) => (
              <span key={item.id} className="truncate">
                {sign}
                {item.quantity} {item.product.name}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Data",
      cell: ({ getValue }) => formatDateTime(getValue<string>()),
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
        {meta?.total} movimentaç{meta?.total !== 1 ? "ões" : "ão"} no total
      </span>

      <TableComponent
        data={data}
        columns={movementColumns}
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
