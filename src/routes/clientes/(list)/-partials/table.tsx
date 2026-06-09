import { StatusBadge, Table as TableComponent } from "@components";
import type { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "@tanstack/react-router";
import type { IPagination } from "@shared/interfaces";
import { formatPhone } from "@shared/helpers/string";
import type { CustomerWithMainAddressAndOrdersCount } from "../-types";

type Props = {
  data: Array<CustomerWithMainAddressAndOrdersCount>;
  meta?: IPagination<unknown>["meta"];
  limit: number;
  isLoading?: boolean;
  isError?: boolean;
};

export const Table = ({ data, meta, limit, isLoading, isError }: Props) => {
  const navigate = useNavigate({ from: "/clientes/" });

  const customerColumns: ColumnDef<CustomerWithMainAddressAndOrdersCount>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ getValue }) => getValue<string | null>() ?? "-",
    },
    {
      accessorKey: "phone",
      header: "Telefone",
      cell: ({ getValue }) => formatPhone(getValue<string>()),
    },
    {
      accessorKey: "mainAddress",
      header: "Bairro",
      cell: ({ row }) => {
        return row.original.mainAddress.neighborhood;
      },
    },
    {
      accessorKey: "allOrdersCount",
      header: "Todos pedidos",
      cell: ({ getValue }) => (
        <span className="ml-10">{getValue<number>()}</span>
      ),
    },
    {
      accessorKey: "cancelledOrdersCount",
      header: "Pedidos cancelados",
      cell: ({ getValue }) => (
        <span className="ml-14">{getValue<number>()}</span>
      ),
    },
    {
      accessorKey: "deliveredOrdersCount",
      header: "Pedidos entregues",
      cell: ({ getValue }) => (
        <span className="ml-15">{getValue<number>()}</span>
      ),
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
        {meta?.total} cliente{meta?.total !== 1 ? "s" : ""} no total
      </span>

      <TableComponent
        data={data}
        columns={customerColumns}
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
