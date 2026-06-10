import {
  Table as TableComponent,
  Toggle,
  Tooltip,
  TrashButton,
} from "@components";
import type { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "@tanstack/react-router";
import type { IPagination } from "@shared/interfaces";
import { formatPhone } from "@shared/helpers/string";
import type { CustomerWithMainAddressAndOrdersCount } from "../-types";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCustomersService } from "@services";
import { RemoveModal, StatusModal } from "../../-partials";

type Props = {
  data: Array<CustomerWithMainAddressAndOrdersCount>;
  meta?: IPagination<unknown>["meta"];
  limit: number;
  isLoading?: boolean;
  isError?: boolean;
};

type ModalOpen =
  | { mode: "remove-customer"; customerId: string }
  | { mode: "toggle-status"; customer: CustomerWithMainAddressAndOrdersCount };

export const Table = ({ data, meta, limit, isLoading, isError }: Props) => {
  const [modalOpen, setModalOpen] = useState<ModalOpen | null>(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/clientes/" });
  const { getCustomers, activateCustomer, deactivateCustomer, removeCustomer } =
    useCustomersService();

  const removeCustomerMutation = useMutation({
    mutationFn: removeCustomer,
    onSuccess: () => {
      toast.success("Cliente removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: [getCustomers.key] });
      setModalOpen(null);
    },
  });

  const toggleStatusMutation = useMutation({
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
              disabled={toggleStatusMutation.isPending}
            />
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        return (
          <Tooltip
            disabled={row.original.allOrdersCount === 0}
            content={
              <>
                Não é possível remover esse cliente
                <br /> pois ele possui pedidos vinculados.
              </>
            }
          >
            <span>
              <TrashButton
                disabled={row.original.allOrdersCount >= 0}
                onClick={() =>
                  setModalOpen({
                    mode: "remove-customer",
                    customerId: row.original.id,
                  })
                }
              />
            </span>
          </Tooltip>
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
        onRowClick={(customer) =>
          navigate({
            to: "/clientes/visualizar/$customerId",
            params: { customerId: customer.id },
          })
        }
      />

      {meta?.totalPages && (
        <TableComponent.Pagination meta={meta} onChangePage={setPage} />
      )}

      <RemoveModal
        isOpen={modalOpen?.mode === "remove-customer"}
        onClose={() => setModalOpen(null)}
        canClose={!removeCustomerMutation.isPending}
        onConfirm={() => {
          if (modalOpen?.mode === "remove-customer") {
            removeCustomerMutation.mutate(modalOpen.customerId);
          }
        }}
      />

      <StatusModal
        isOpen={modalOpen?.mode === "toggle-status"}
        canClose={!toggleStatusMutation.isPending}
        mode={
          modalOpen?.mode === "toggle-status" && modalOpen.customer.isActive
            ? "deactivate"
            : "activate"
        }
        onClose={() => setModalOpen(null)}
        onConfirm={() => {
          if (modalOpen?.mode === "toggle-status") {
            toggleStatusMutation.mutate(modalOpen.customer);
          }
        }}
      />
    </div>
  );
};
