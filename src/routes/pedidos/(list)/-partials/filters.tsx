import { RefetchButton, SearchInput } from "@components";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useRef } from "react";
import { FiX } from "react-icons/fi";
import type { SearchInputRef } from "@/components/search-input";

type Props = {
  onRefetch: () => void;
  isRefetching: boolean;
};

export const Filters = ({ onRefetch, isRefetching }: Props) => {
  const { searchTerm } = useSearch({ from: "/pedidos/(list)/" });

  const navigate = useNavigate({ from: "/pedidos/" });

  const searchRef = useRef<SearchInputRef>(null);

  const hasActiveFilters = !!searchTerm;

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
