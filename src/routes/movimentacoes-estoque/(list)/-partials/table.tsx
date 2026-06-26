import { StatusBadge, Table as TableComponent } from "@components";
import { formatPrice } from "@shared/helpers/number";
import { formatDateTime } from "@shared/helpers/string";
import type { IPagination } from "@shared/interfaces";
import {
  InventoryMovementOrigin,
  type IInventoryMovement,
} from "@shared/models";
import { Link, useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { RiExternalLinkLine } from "react-icons/ri";
import { MOVEMENT_PROPS_BY_ORIGIN, MOVEMENT_QUANTITY_CLASS } from "../-helpers";

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
        const adminOrigins = [
          InventoryMovementOrigin.ADMIN_REMOVAL,
          InventoryMovementOrigin.ADMIN_ORDER_CANCELLATION,
          InventoryMovementOrigin.ADMIN_RESTOCK,
        ];

        const isAdmin = adminOrigins.includes(row.original.origin);

        if (!isAdmin) return null;

        return <StatusBadge variant="alert">Admin</StatusBadge>;
      },
    },
    {
      id: "total",
      header: "Total",
      cell: ({ row }) => {
        const variant =
          MOVEMENT_PROPS_BY_ORIGIN[row.original.origin].totalVariant;
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
      id: "items",
      header: "Itens",
      cell: ({ row }) => {
        const variant =
          MOVEMENT_PROPS_BY_ORIGIN[row.original.origin].quantityVariant;

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
                <span className="text-gray-400 text-xs">
                  ({formatPrice(item.price)} unidade)
                </span>
              </span>
            ))}
          </div>
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
