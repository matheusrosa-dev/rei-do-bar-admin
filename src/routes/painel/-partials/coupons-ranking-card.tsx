import { StatusBadge } from "@components";
import { formatPrice } from "@shared/helpers/number";
import type { CouponRanking } from "@shared/services/dashboard/types";
import { RankingCard } from "./ranking-card";
import { RankingRow } from "./ranking-row";

type Props = {
  data: CouponRanking[];
};

export const CouponsRankingCard = ({ data }: Props) => (
  <RankingCard
    title="Cupons mais usados"
    isEmpty={data.length === 0}
    emptyMessage="Nenhum cupom usado no período."
  >
    {data.map((coupon, index) => (
      <RankingRow
        key={coupon.code}
        position={index + 1}
        title={<StatusBadge variant="neutral">{coupon.code}</StatusBadge>}
        meta={`-${formatPrice(coupon.discountTotal)} em desconto`}
        metaClassName="text-green-400"
        value={String(coupon.ordersCount)}
        unit="pedidos com o cupom"
      />
    ))}
  </RankingCard>
);
