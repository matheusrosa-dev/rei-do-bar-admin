import { ConfirmModal, Table as TableComponent, Toggle } from "@components";
import type { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "@tanstack/react-router";
import type { IPagination } from "@shared/interfaces";
import { formatPhone } from "@shared/helpers/string";
import type { CustomerWithMainAddressAndOrdersCount } from "../-types";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCustomersService } from "@services";

type Props = {
  data: Array<CustomerWithMainAddressAndOrdersCount>;
  meta?: IPagination<unknown>["meta"];
  limit: number;
  isLoading?: boolean;
  isError?: boolean;
};

type ModalOpen = {
  mode: "toggle-status";
  customer: CustomerWithMainAddressAndOrdersCount;
};

export const Table = ({ data, meta, limit, isLoading, isError }: Props) => {
  const [modalOpen, setModalOpen] = useState<ModalOpen | null>(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/clientes/" });
  const { getCustomers, activateCustomer, deactivateCustomer } =
    useCustomersService();

  const toggleCustomerMutation = useMutation({
    mutationFn: (customer: CustomerWithMainAddressAndOrdersCount) => {
      if (customer.isActive) {
        return deactivateCustomer(customer.id);
      }

      return activateCustomer(customer.id);
    },
    onSuccess: (updatedCustomer) => {
      toast.success(
        `Cliente ${updatedCustomer.isActive ? "ativado" : "desativado"} com sucesso!`,
      );
      queryClient.invalidateQueries({ queryKey: [getCustomers.key] });
      setModalOpen(null);
    },
  });

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
      cell: ({ row }) => {
        const customer = row.original;

        return (
          <span onClick={(e) => e.stopPropagation()} className="flex w-fit">
            <Toggle
              checked={customer.isActive}
              onCheckedChange={() =>
                setModalOpen({ mode: "toggle-status", customer })
              }
              disabled={toggleCustomerMutation.isPending}
            />
          </span>
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

      <ConfirmModal
        isOpen={modalOpen?.mode === "toggle-status"}
        title={
          modalOpen?.mode === "toggle-status" && modalOpen.customer.isActive
            ? "Desativar cliente?"
            : "Ativar cliente?"
        }
        description={
          modalOpen?.mode === "toggle-status" && modalOpen.customer.isActive
            ? "O cliente ficará indisponível para seleção de produtos e todos os produtos vinculados serão automaticamente desativados."
            : "O cliente voltará a ficar disponível para seleção de produtos."
        }
        onClose={() => setModalOpen(null)}
        variant={
          modalOpen?.mode === "toggle-status" && modalOpen.customer.isActive
            ? "danger"
            : "default"
        }
        canClose={!toggleCustomerMutation.isPending}
        confirmLabel={
          modalOpen?.mode === "toggle-status" && modalOpen.customer.isActive
            ? "Desativar"
            : "Ativar"
        }
        onConfirm={() => {
          if (modalOpen?.mode === "toggle-status") {
            toggleCustomerMutation.mutate(modalOpen.customer);
          }
        }}
      />
    </div>
  );
};
