import { RefetchButton, SearchInput, Select, SortSelect } from "@components";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useRef } from "react";
import { FiX } from "react-icons/fi";
import type { SearchInputRef } from "../../../../components/search-input";
import type { GetCustomersSortKey } from "@shared/services/customers/types";
import type { SortDirection } from "@shared/interfaces";

type Props = {
  onRefetch: () => void;
  isRefetching: boolean;
};

const STATUS_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "true", label: "Ativo" },
  { value: "false", label: "Inativo" },
];

export const Filters = ({ onRefetch, isRefetching }: Props) => {
  const { isActive, searchTerm, sortKey, sortDirection } = useSearch({
    from: "/clientes/(list)/",
  });

  const navigate = useNavigate({ from: "/clientes/" });

  const searchRef = useRef<SearchInputRef>(null);

  const onChangeStatusFilter = (value: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        isActive: value === "all" ? undefined : value === "true",
        page: undefined,
      }),
    });
  };

  const onChangeSorting = (
    key: GetCustomersSortKey,
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

  const statusValue =
    isActive === true ? "true" : isActive === false ? "false" : "all";

  const hasActiveFilters = statusValue !== "all" || sortKey || !!searchTerm;

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

        <div className="w-28">
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
          <SortSelect
            label="Todos pedidos"
            value={sortKey === "allOrdersCount" ? sortDirection : undefined}
            onChange={(value) => onChangeSorting("allOrdersCount", value)}
          />
        </div>

        <div className="w-40">
          <SortSelect
            label="Pedidos entregues"
            value={
              sortKey === "deliveredOrdersCount" ? sortDirection : undefined
            }
            onChange={(value) => onChangeSorting("deliveredOrdersCount", value)}
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
