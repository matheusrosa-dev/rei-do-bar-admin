import { Input, RefetchButton, Select, SortSelect } from "@components";
import type { SortDirection } from "@shared/interfaces";
import type { ICategory } from "@shared/models";
import type { GetProductsSortKey } from "@shared/services/products/types";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

type Props = {
  categories: ICategory[];
  onRefetch: () => void;
  isRefetching: boolean;
};

const STATUS_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "true", label: "Ativo" },
  { value: "false", label: "Inativo" },
];

export const Filters = ({ categories, onRefetch, isRefetching }: Props) => {
  const {
    categoryId = "all",
    isActive,
    sortKey,
    sortDirection,
    searchTerm,
  } = useSearch({
    from: "/produtos/(list)/",
  });

  const [searchInput, setSearchInput] = useState(searchTerm ?? "");

  const navigate = useNavigate({
    from: "/produtos/",
  });

  const categoryOptions = [
    { value: "all", label: "Todas as categorias" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  const onChangeCategoryFilter = (value: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        categoryId: value === "all" ? undefined : value,
        page: undefined,
      }),
    });
  };

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
    key: GetProductsSortKey,
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate({
        search: (prev) => ({
          ...prev,
          searchTerm: searchInput || undefined,
          page: undefined,
        }),
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchInput, navigate]);

  const statusValue =
    isActive === true ? "true" : isActive === false ? "false" : "all";

  const hasActiveFilters =
    categoryId !== "all" || statusValue !== "all" || sortKey || !!searchTerm;

  return (
    <div className="flex items-end gap-3">
      <div className="flex gap-3 flex-wrap">
        <div className="w-64">
          <Input
            label="Pesquisar"
            placeholder="Nome do produto..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="w-52">
          <Select
            label="Categoria"
            placeholder="Todas as categorias"
            options={categoryOptions}
            value={categoryId}
            onChange={(newValue) => onChangeCategoryFilter(newValue || "all")}
            active={categoryId !== "all"}
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
            label="Estoque"
            value={sortKey === "stock" ? sortDirection : undefined}
            onChange={(value) => onChangeSorting("stock", value)}
          />
        </div>

        <div className="w-40">
          <SortSelect
            label="Destaque"
            value={sortKey === "sortOrder" ? sortDirection : undefined}
            onChange={(value) => onChangeSorting("sortOrder", value)}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => {
            setSearchInput("");
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
