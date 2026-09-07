import { Wrapper } from "@components";
import type {
  ICategoryGroupWithProducts,
  IProductWithCategory,
} from "@shared/models";
import { useState } from "react";
import { FiX } from "react-icons/fi";
import { AddProductCard } from "./add-product-card";
import { FilterChips } from "./filter-chips";
import { ProductCard } from "./product-card";

type Props = {
  group: ICategoryGroupWithProducts;
  pendingProductId: string | null;
  onToggleProduct: (product: IProductWithCategory) => void;
  onRemoveProduct: (product: IProductWithCategory) => void;
};

type FilterOption = {
  value: string;
  label: string;
  matches: (product: IProductWithCategory) => boolean;
};

const LOW_STOCK_LIMIT = 10;

const STOCK_OPTIONS: FilterOption[] = [
  {
    value: "out-of-stock",
    label: "Esgotado",
    matches: (product) => product.stockQuantity === 0,
  },
  {
    value: "low-stock",
    label: "Acabando",
    matches: (product) =>
      product.stockQuantity > 0 && product.stockQuantity <= LOW_STOCK_LIMIT,
  },
];

const STATUS_OPTIONS: FilterOption[] = [
  {
    value: "active",
    label: "Ativo",
    matches: (product) => product.isActive,
  },
  {
    value: "inactive",
    label: "Inativo",
    matches: (product) => !product.isActive,
  },
];

const getCategoryOptions = (products: IProductWithCategory[]) => {
  const categoriesById = new Map(
    products.map((product) => [product.category.id, product.category]),
  );

  if (categoriesById.size < 2) return [];

  return [...categoriesById.values()].map<FilterOption>((category) => ({
    value: category.id,
    label: category.pluralName,
    matches: (product) => product.category.id === category.id,
  }));
};

const getFilterDimensions = (products: IProductWithCategory[]) => [
  {
    key: "category",
    legend: "Categoria",
    options: getCategoryOptions(products),
  },
  {
    key: "stock",
    legend: "Estoque",
    options: STOCK_OPTIONS.filter((option) => products.some(option.matches)),
  },
  {
    key: "status",
    legend: "Status",
    options: products.length > 0 ? STATUS_OPTIONS : [],
  },
];

export const ProductGroupBlock = ({
  group,
  pendingProductId,
  onToggleProduct,
  onRemoveProduct,
}: Props) => {
  const [selection, setSelection] = useState<Record<string, string>>({});

  const dimensions = getFilterDimensions(group.products).map((dimension) => {
    const selectedOption = dimension.options.find(
      (option) => option.value === selection[dimension.key],
    );

    return { ...dimension, selectedOption };
  });

  const products = group.products.filter((product) =>
    dimensions.every(
      ({ selectedOption }) =>
        !selectedOption || selectedOption.matches(product),
    ),
  );

  const hasSelection = dimensions.some(({ selectedOption }) => selectedOption);

  const onClearFilters = () => setSelection({});

  const onSelectFilter = (
    dimension: (typeof dimensions)[number],
    value: string,
  ) => {
    const nextValue = dimension.selectedOption?.value === value ? null : value;

    const nextSelection: Record<string, string> = {};

    for (const item of dimensions) {
      const itemValue =
        item.key === dimension.key ? nextValue : item.selectedOption?.value;

      if (itemValue) nextSelection[item.key] = itemValue;
    }

    setSelection(nextSelection);
  };

  return (
    <Wrapper className="flex flex-col gap-4">
      <h2 className="text-white text-lg font-bold">{group.name}</h2>

      <hr className="border-white/10" />

      <div className="flex flex-wrap items-end gap-x-6 gap-y-3 empty:hidden">
        {dimensions
          .filter((dimension) => dimension.options.length > 0)
          .map((dimension) => (
            <FilterChips
              key={dimension.key}
              legend={dimension.legend}
              options={dimension.options}
              selected={dimension.selectedOption?.value ?? null}
              onSelect={(value) => onSelectFilter(dimension, value)}
            />
          ))}

        {hasSelection && (
          <button
            type="button"
            onClick={onClearFilters}
            className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <FiX className="size-4" />
            Limpar filtros
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isPending={pendingProductId === product.id}
            onToggle={() => onToggleProduct(product)}
            onRemove={() => onRemoveProduct(product)}
          />
        ))}

        {products.length === 0 && hasSelection && (
          <div
            role="status"
            className="col-span-full flex items-center justify-center p-8 rounded-lg border border-dashed border-white/10 text-gray-400 text-sm"
          >
            Nenhum produto para os filtros selecionados.
          </div>
        )}

        <AddProductCard
          groupId={group.id}
          className={products.length === 0 ? "col-span-full" : undefined}
        />
      </div>
    </Wrapper>
  );
};
