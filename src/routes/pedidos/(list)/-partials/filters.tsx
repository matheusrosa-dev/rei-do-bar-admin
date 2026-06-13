import type { SearchInputRef } from "@/components/search-input";
import { RefetchButton, SearchInput, Select, SortSelect } from "@components";
import {
  ORDER_STATUS_LABEL,
  PAYMENT_TYPE_LABEL,
} from "@shared/helpers/order-status";
import type { SortDirection } from "@shared/interfaces";
import { OrderStatus, PaymentType } from "@shared/models";
import type { GetOrdersSortKey } from "@shared/services/orders/types";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useRef } from "react";
import { FiX } from "react-icons/fi";

type Props = {
  onRefetch: () => void;
  isRefetching: boolean;
};

const STATUS_OPTIONS = [
  { value: "all", label: "Todos" },
  ...Object.values(OrderStatus).map((status) => ({
    value: status,
    label: ORDER_STATUS_LABEL[status],
  })),
];

const PAYMENT_TYPE_OPTIONS = [
  { value: "all", label: "Todos" },
  ...Object.values(PaymentType).map((paymentType) => ({
    value: paymentType,
    label: PAYMENT_TYPE_LABEL[paymentType],
  })),
];

export const Filters = ({ onRefetch, isRefetching }: Props) => {
  const { searchTerm, status, paymentType, sortKey, sortDirection } = useSearch(
    {
      from: "/pedidos/(list)/",
    },
  );

  const searchRef = useRef<SearchInputRef>(null);

  const navigate = useNavigate({
    from: "/pedidos/",
  });

  const onChangeStatusFilter = (value: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        status: value === "all" ? undefined : (value as OrderStatus),
        page: undefined,
      }),
    });
  };

  const onChangePaymentTypeFilter = (value: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        paymentType: value === "all" ? undefined : (value as PaymentType),
        page: undefined,
      }),
    });
  };

  const onChangeSorting = (
    key: GetOrdersSortKey,
    direction: SortDirection | undefined,
  ) => {
    navigate({
      search: (prev) => ({
        ...prev,
        page: undefined,
        sortKey: direction ? key : undefined,
        sortDirection: direction,
      }),
    });
  };

  const statusValue = status ?? "all";
  const paymentTypeValue = paymentType ?? "all";

  const hasActiveFilters = Boolean(
    statusValue !== "all" ||
      paymentTypeValue !== "all" ||
      sortKey ||
      searchTerm,
  );

  return (
    <div className="flex items-end gap-3">
      <div className="flex gap-3 flex-wrap">
        <div className="w-64">
          <SearchInput
            ref={searchRef}
            searchTerm={searchTerm}
            onChangeSearchTerm={(newValue) =>
              navigate({
                search: (prev) => ({
                  ...prev,
                  searchTerm: newValue,
                  page: undefined,
                }),
              })
            }
          />
        </div>

        <div className="w-48">
          <Select
            label="Status"
            placeholder="Todos"
            options={STATUS_OPTIONS}
            value={statusValue}
            onChange={(newValue) => onChangeStatusFilter(newValue || "all")}
            active={statusValue !== "all"}
          />
        </div>

        <div className="w-40">
          <Select
            label="Pagamento"
            placeholder="Todos"
            options={PAYMENT_TYPE_OPTIONS}
            value={paymentTypeValue}
            onChange={(newValue) =>
              onChangePaymentTypeFilter(newValue || "all")
            }
            active={paymentTypeValue !== "all"}
          />
        </div>

        <div className="w-40">
          <SortSelect
            label="Itens"
            value={sortKey === "itemsQuantity" ? sortDirection : undefined}
            onChange={(value) => onChangeSorting("itemsQuantity", value)}
          />
        </div>

        <div className="w-40">
          <SortSelect
            label="Total"
            value={sortKey === "total" ? sortDirection : undefined}
            onChange={(value) => onChangeSorting("total", value)}
          />
        </div>

        <div className="w-40">
          <SortSelect
            label="Criado em"
            value={sortKey === "createdAt" ? sortDirection : undefined}
            onChange={(value) => onChangeSorting("createdAt", value)}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => {
            searchRef.current?.clear();
            navigate({ search: () => ({}) });
          }}
          className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <FiX className="size-4" />
          Limpar filtros
        </button>
      )}

      <RefetchButton
        onRefetch={onRefetch}
        isRefetching={isRefetching}
        className="ml-auto"
      />
    </div>
  );
};
