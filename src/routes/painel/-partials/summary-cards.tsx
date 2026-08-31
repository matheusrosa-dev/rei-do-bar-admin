import { formatMinutes } from "@shared/helpers/duration";
import type { DeliveryPersonsPerformanceTotals } from "@shared/services/dashboard/types";
import { MdAvTimer, MdCancel, MdTimerOff } from "react-icons/md";
import { SummaryCard, type SummaryCardProps } from "./summary-card";

type Props = {
  totals: DeliveryPersonsPerformanceTotals;
};

export const SummaryCards = ({ totals }: Props) => {
  const cards: SummaryCardProps[] = [
    {
      label: "Pedidos cancelados após envio",
      value: String(totals.cancelledOrdersCount),
      icon: MdCancel,
      iconClassName: "text-red-500",
    },
    {
      label: "Tempo médio de entrega",
      value: formatMinutes(totals.averageDeliveryMinutes),
      icon: MdAvTimer,
      iconClassName: "text-amber-500",
    },
    {
      label: "Tempo médio cancelamento após envio",
      value: formatMinutes(totals.averageCancellationAfterShippingMinutes),
      icon: MdTimerOff,
      iconClassName: "text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <SummaryCard key={card.label} {...card} />
      ))}
    </div>
  );
};
