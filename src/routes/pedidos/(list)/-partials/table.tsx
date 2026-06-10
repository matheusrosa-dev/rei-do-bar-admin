import { StatusBadge, Table as TableComponent } from "@components";
import type { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "@tanstack/react-router";
import type { IPagination } from "@shared/interfaces";
import type { IOrder } from "@shared/models";
import { formatPrice } from "@shared/helpers/number";
import { formatDate } from "@shared/helpers/string";
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_VARIANT,
  PAYMENT_TYPE_LABEL,
} from "@shared/helpers/order-status";

type Props = {
  data: IOrder[];
  meta?: IPagination<unknown>["meta"];
  limit: number;
  isLoading?: boolean;
  isError?: boolean;
};

export const Table = ({ data, meta, limit, isLoading, isError }: Props) => {
  const navigate = useNavigate({ from: "/pedidos/" });

  const orderColumns: ColumnDef<IOrder>[] = [
    {
      accessorKey: "orderNumber",
      header: "Pedido",
      cell: ({ getValue }) => (
        <span className="text-amber-500 font-bold">#{getValue<number>()}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue<IOrder["status"]>();
        return (
          <StatusBadge variant={ORDER_STATUS_VARIANT[status]}>
            {ORDER_STATUS_LABEL[status]}
          </StatusBadge>
        );
      },
    },
    {
      accessorKey: "paymentType",
      header: "Pagamento",
      cell: ({ getValue }) =>
        PAYMENT_TYPE_LABEL[getValue<IOrder["paymentType"]>()],
    },
    {
      accessorKey: "address",
      header: "Endereço",
    },
    {
      accessorKey: "deliveryFee",
      header: "Frete",
      cell: ({ getValue }) => formatPrice(getValue<number>()),
    },
    {
      accessorKey: "createdAt",
      header: "Data",
      cell: ({ getValue }) => formatDate(getValue<string>()),
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
      />

      {meta?.totalPages && (
        <TableComponent.Pagination meta={meta} onChangePage={setPage} />
      )}
    </div>
  );
};
