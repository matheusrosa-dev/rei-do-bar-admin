import { formatPercentage, formatPrice } from "@shared/helpers/number";
import type { RevenueTotals } from "@shared/services/dashboard/types";
import { MdLocalOffer, MdPayments } from "react-icons/md";
import { SummaryCard, type SummaryCardProps } from "./summary-card";

type Props = {
  totals: RevenueTotals;
};

export const RevenueCards = ({ totals }: Props) => {
  const cards: SummaryCardProps[] = [
    {
      label: "Faturamento",
      value: formatPrice(totals.revenue),
      icon: MdPayments,
      iconClassName: "text-amber-500",
    },
    {
      label: "Desconto em cupons",
      value: formatPrice(totals.couponDiscount),
      icon: MdLocalOffer,
      iconClassName: "text-green-400",
      hint:
        totals.couponDiscountPercentage === null
          ? undefined
          : `${formatPercentage(totals.couponDiscountPercentage)} do faturamento bruto`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.map((card) => (
        <SummaryCard key={card.label} {...card} />
      ))}
    </div>
  );
};
