import { Select } from "@components";
import type { ICategory } from "@shared/models";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { FiRefreshCw, FiX } from "react-icons/fi";

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

const STOCK_ORDER_OPTIONS = [
  { value: "all", label: "Padrão" },
  { value: "asc", label: "Menor estoque" },
  { value: "desc", label: "Maior estoque" },
];

export const Filters = ({ categories, onRefetch, isRefetching }: Props) => {
  const {
    categoryId = "all",
    isActive,
    stockOrder,
  } = useSearch({
    from: "/products/(list)/",
  });

  const navigate = useNavigate({
    from: "/products/",
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

  const onChangeStockOrderFilter = (value: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        stockOrder: value === "asc" || value === "desc" ? value : undefined,
        page: undefined,
      }),
    });
  };

  const statusValue =
    isActive === true ? "true" : isActive === false ? "false" : "all";
  const stockOrderValue = stockOrder ?? "all";

  const hasActiveFilters =
    categoryId !== "all" || statusValue !== "all" || stockOrderValue !== "all";

  const clearFilters = () => {
    navigate({
      search: () => ({ page: undefined }),
    });
  };

  return (
    <div className="flex items-end gap-3">
      <div className="w-52">
        <Select
          label="Categoria"
          placeholder="Todas as categorias"
          options={categoryOptions}
          value={categoryId}
          onValueChange={onChangeCategoryFilter}
          active={categoryId !== "all"}
        />
      </div>
      <div className="w-28">
        <Select
          label="Status"
          placeholder="Todos"
          options={STATUS_OPTIONS}
          value={statusValue}
          onValueChange={onChangeStatusFilter}
          active={statusValue !== "all"}
        />
      </div>
      <div className="w-40">
        <Select
          label="Estoque"
          placeholder="Padrão"
          options={STOCK_ORDER_OPTIONS}
          value={stockOrderValue}
          onValueChange={onChangeStockOrderFilter}
          active={stockOrderValue !== "all"}
        />
      </div>
      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <FiX className="size-4" />
          Limpar filtros
        </button>
      )}
      <button
        type="button"
        onClick={onRefetch}
        disabled={isRefetching}
        className="select-none ml-auto flex items-center gap-1.5 px-3 py-2.5 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiRefreshCw
          className={`size-4 ${isRefetching ? "animate-spin" : ""}`}
        />
        Atualizar
      </button>
    </div>
  );
};
