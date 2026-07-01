import { RefetchButton, SearchInput, Select, SortSelect } from "@components";
import type { SortDirection } from "@shared/interfaces";
import type { GetCouponsSortKey } from "@shared/services/coupons/types";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useRef } from "react";
import { FiX } from "react-icons/fi";
import type { SearchInputRef } from "@/components/search-input";
import {
  type CouponSituationFilter,
  SITUATION_FILTER_OPTIONS,
} from "../-helpers";

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
  const { isActive, situation, sortKey, sortDirection, searchTerm } = useSearch(
    {
      from: "/cupons/(list)/",
    },
  );

  const searchRef = useRef<SearchInputRef>(null);

  const navigate = useNavigate({
    from: "/cupons/",
  });

  const onChangeStatusFilter = (value: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        isActive: value === "all" ? undefined : value === "true",
        page: undefined,
      }),
    });
  };

  const onChangeSituationFilter = (value: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        situation:
          value === "all" ? undefined : (value as CouponSituationFilter),
        page: undefined,
      }),
    });
  };

  const onChangeSorting = (
    key: GetCouponsSortKey,
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

  const hasActiveFilters = Boolean(
    statusValue !== "all" || situation || sortKey || !!searchTerm,
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
          <Select
            label="Situação"
            placeholder="Todas"
            options={[
              { value: "all", label: "Todas" },
              ...SITUATION_FILTER_OPTIONS,
            ]}
            value={situation ?? "all"}
            onChange={(newValue) => onChangeSituationFilter(newValue || "all")}
            active={Boolean(situation)}
          />
        </div>

        <div className="w-40">
          <SortSelect
            label="Usos"
            value={sortKey === "usageCount" ? sortDirection : undefined}
            onChange={(value) => onChangeSorting("usageCount", value)}
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
