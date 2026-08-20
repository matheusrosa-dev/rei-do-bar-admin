import { StatusBadge, Table as TableComponent, Tooltip } from "@components";
import { formatDateTime } from "@shared/helpers/string";
import type { IPagination } from "@shared/interfaces";
import type { INotification } from "@shared/models";
import { useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import {
  NOTIFICATION_STATUS_LABEL,
  NOTIFICATION_STATUS_VARIANT,
  NOTIFICATION_TARGET_LABEL,
} from "../-helpers";
import { NotificationDetailModal } from "./notification-detail-modal";

type Props = {
  data: INotification[];
  meta?: IPagination<unknown>["meta"];
  limit: number;
  isLoading?: boolean;
  isError?: boolean;
};

export const Table = ({ data, meta, limit, isLoading, isError }: Props) => {
  const [selectedNotification, setSelectedNotification] =
    useState<INotification | null>(null);

  const navigate = useNavigate({ from: "/notificacoes/" });

  const notificationColumns: ColumnDef<INotification>[] = [
    {
      accessorKey: "title",
      header: "Notificação",
      cell: ({ getValue }) => (
        <span className="block max-w-xs truncate">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: "target",
      header: "Segmento",
      cell: ({ row }) => (
        <StatusBadge variant="neutral">
          {NOTIFICATION_TARGET_LABEL[row.original.target]}
        </StatusBadge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge variant={NOTIFICATION_STATUS_VARIANT[row.original.status]}>
          {NOTIFICATION_STATUS_LABEL[row.original.status]}
        </StatusBadge>
      ),
    },
    {
      accessorKey: "customersCount",
      header: () => (
        <Tooltip content="Clientes do segmento que tinham push token cadastrado no momento do envio">
          <button type="button" className="cursor-help uppercase">
            Alcance
          </button>
        </Tooltip>
      ),
      cell: ({ getValue }) => getValue<number>(),
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
        {meta?.total} notificaç{meta?.total !== 1 ? "ões" : "ão"} no total
      </span>

      <TableComponent
        data={data}
        columns={notificationColumns}
        isLoading={isLoading}
        isError={isError}
        limit={limit}
        onRowClick={(notification) => setSelectedNotification(notification)}
      />

      {!!meta?.totalPages && (
        <TableComponent.Pagination meta={meta} onChangePage={setPage} />
      )}

      <NotificationDetailModal
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
      />
    </div>
  );
};
