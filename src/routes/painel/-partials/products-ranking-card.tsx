import { ImagePreview } from "@components";
import type { ProductRanking } from "@shared/services/dashboard/types";
import { RankingCard } from "./ranking-card";
import { RankingRow } from "./ranking-row";

type Props = {
  data: ProductRanking[];
};

export const ProductsRankingCard = ({ data }: Props) => (
  <RankingCard
    title="Produtos mais vendidos"
    isEmpty={data.length === 0}
    emptyMessage="Nenhum produto vendido no período."
  >
    {data.map((product, index) => (
      <RankingRow
        key={product.name}
        position={index + 1}
        media={
          <ImagePreview src={product.imageUrl} className="w-10 h-10 shrink-0" />
        }
        title={
          <span className="text-sm font-medium text-gray-200 truncate">
            {product.name}
          </span>
        }
        meta={`Em ${product.ordersCount} pedidos`}
        value={String(product.soldQuantity)}
        unit="unidades"
      />
    ))}
  </RankingCard>
);
