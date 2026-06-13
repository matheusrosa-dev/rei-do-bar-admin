import { StatusBadge, Table as TableComponent } from "@components";
import { formatPrice } from "@shared/helpers/number";
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_VARIANT,
  PAYMENT_TYPE_LABEL,
} from "@shared/helpers/order-status";
import { formatDateTime } from "@shared/helpers/string";
import type { IPagination } from "@shared/interfaces";
import { OrderStatus, type IOrderWithItemsAndCustomer } from "@shared/models";
import { Link, useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { OrderDetailModal } from "./order-detail-modal";
import { RiExternalLinkLine } from "react-icons/ri";

type Props = {
  data: IOrderWithItemsAndCustomer[];
  meta?: IPagination<unknown>["meta"];
  limit: number;
  isLoading?: boolean;
  isError?: boolean;
};

export const Table = ({ data, meta, limit, isLoading, isError }: Props) => {
  const [selectedOrder, setSelectedOrder] =
    useState<IOrderWithItemsAndCustomer | null>(null);

  const navigate = useNavigate({ from: "/pedidos/" });

  const orderColumns: ColumnDef<IOrderWithItemsAndCustomer>[] = [
    {
      accessorKey: "orderNumber",
      header: "Pedido",
      cell: ({ getValue }) => (
        <span className="text-amber-500 font-bold">#{getValue<number>()}</span>
      ),
    },
    {
      accessorKey: "customer",
      header: "Cliente",
      cell: ({ row }) => (
        <Link
          className="text-gray-400 text-sm underline flex w-fit flex-nowrap items-center gap-1 duration-150 hover:text-white"
          to="/clientes/visualizar/$customerId"
          params={{ customerId: row.original.customerId }}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          {row.original.customer?.deletedAt
            ? "Cliente removido"
            : row.original.customer.name}
          <RiExternalLinkLine />
        </Link>
      ),
    },
    {
      accessorKey: "paymentType",
      header: "Pagamento",
      cell: ({ row }) => PAYMENT_TYPE_LABEL[row.original.paymentType],
    },
    {
      id: "items",
      header: "Itens",
      cell: ({ row }) => row.original.items.length,
    },
    {
      accessorKey: "deliveryFee",
      header: "Frete",
      cell: ({ getValue }) => formatPrice(getValue<number>()),
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ getValue }) => formatPrice(getValue<number>()),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge variant={ORDER_STATUS_VARIANT[row.original.status]}>
          {ORDER_STATUS_LABEL[row.original.status]}
        </StatusBadge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Criado em",
      cell: ({ getValue }) => formatDateTime(getValue<string>()),
    },
    {
      id: "finalizedAt",
      header: "Finalizado em",
      cell: ({ row }) => {
        const isFinalized =
          row.original.status === OrderStatus.CANCELLED ||
          row.original.status === OrderStatus.DELIVERED;

        if (isFinalized) {
          return formatDateTime(row.original.updatedAt);
        }

        return "-";
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
        {meta?.total} pedido{meta?.total !== 1 ? "s" : ""} no total
      </span>

      <TableComponent
        data={data}
        columns={orderColumns}
        isLoading={isLoading}
        isError={isError}
        limit={limit}
        onRowClick={(order) => setSelectedOrder(order)}
      />

      {meta?.totalPages && (
        <TableComponent.Pagination meta={meta} onChangePage={setPage} />
      )}

      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
};
