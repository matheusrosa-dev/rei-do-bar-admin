import { StatusBadge, Table as TableComponent } from "@components";
import { formatPrice } from "@shared/helpers/number";
import { formatDateTime } from "@shared/helpers/string";
import type { IPagination } from "@shared/interfaces";
import type { IInventoryMovement } from "@shared/models";
import { Link, useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { RiExternalLinkLine, RiPencilLine } from "react-icons/ri";
import {
  ADMIN_ORIGINS,
  MOVEMENT_PROPS_BY_ORIGIN,
  MOVEMENT_QUANTITY_CLASS,
} from "../-helpers";
import { StockMovementModal } from "./stock-movement-modal";

type Props = {
  data: IInventoryMovement[];
  meta?: IPagination<unknown>["meta"];
  limit: number;
  isLoading?: boolean;
  isError?: boolean;
};

export const Table = ({ data, meta, limit, isLoading, isError }: Props) => {
  const [editingMovement, setEditingMovement] =
    useState<IInventoryMovement | null>(null);

  const navigate = useNavigate({ from: "/movimentacoes-estoque/" });

  const movementColumns: ColumnDef<IInventoryMovement>[] = [
    {
      accessorKey: "origin",
      header: "Origem",
      cell: ({ row }) => {
        const { originVariant, originTranslation } =
          MOVEMENT_PROPS_BY_ORIGIN[row.original.origin];

        return (
          <StatusBadge variant={originVariant}>{originTranslation}</StatusBadge>
        );
      },
    },
    {
      id: "is-admin",
      cell: ({ row }) => {
        const isAdmin = ADMIN_ORIGINS.includes(row.original.origin);

        if (!isAdmin) return null;

        return <StatusBadge variant="alert">Admin</StatusBadge>;
      },
    },
    {
      id: "items",
      header: "Itens",
      cell: ({ row }) => {
        const { quantityVariant: variant, showsPrice } =
          MOVEMENT_PROPS_BY_ORIGIN[row.original.origin];

        const sign = variant === "active" ? "+" : "-";
        const { products } = row.original;

        return (
          <div className={`flex max-w-48 flex-col gap-2`}>
            {products.map((item) => (
              <span key={item.id} className="whitespace-nowrap">
                <span className={MOVEMENT_QUANTITY_CLASS[variant]}>
                  {sign}
                  {item.quantity} {item.product.name}{" "}
                </span>
                {showsPrice && (
                  <span className="text-gray-400 text-xs">
                    ({formatPrice(item.price)} unidade)
                  </span>
                )}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      id: "total",
      header: "Total",
      cell: ({ row }) => {
        const { totalVariant: variant, showsPrice } =
          MOVEMENT_PROPS_BY_ORIGIN[row.original.origin];

        if (!showsPrice) {
          return "-";
        }

        const sign = variant === "active" ? "+" : "-";

        const total = row.original.products.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );

        return (
          <span
            className={`whitespace-nowrap ${MOVEMENT_QUANTITY_CLASS[variant]}`}
          >
            {sign}
            {formatPrice(total)}
          </span>
        );
      },
    },
    {
      accessorKey: "order",
      header: "Pedido",
      cell: ({ row }) => {
        const order = row.original?.order;
        if (!order) {
          return "-";
        }

        return (
          <Link
            className="text-gray-400 text-sm underline flex w-fit flex-nowrap items-center gap-1 duration-150 hover:text-white"
            to="/pedidos"
            search={{ searchTerm: String(order.orderNumber) }}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            #{order.orderNumber}
            <RiExternalLinkLine />
          </Link>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Data",
      cell: ({ getValue }) => formatDateTime(getValue<string>()),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        if (!row.original.editable) return null;

        return (
          <button
            type="button"
            title="Editar"
            aria-label="Editar reposição de estoque"
            onClick={(e) => {
              e.stopPropagation();
              setEditingMovement(row.original);
            }}
            className="cursor-pointer p-2 rounded-md text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <RiPencilLine className="size-4" />
          </button>
        );
      },
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

      <StockMovementModal
        isOpen={!!editingMovement}
        movement={editingMovement ?? undefined}
        onClose={() => setEditingMovement(null)}
      />
    </div>
  );
};
