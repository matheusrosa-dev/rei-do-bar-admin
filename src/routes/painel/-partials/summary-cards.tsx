import { Wrapper } from "@components";
import { formatMinutes } from "@shared/helpers/duration";
import type { DeliveryPersonsPerformanceTotals } from "@shared/services/dashboard/types";
import type { IconType } from "react-icons";
import { MdAvTimer, MdCancel, MdCheckCircle, MdTimerOff } from "react-icons/md";

type Props = {
  totals: DeliveryPersonsPerformanceTotals;
};

type Card = {
  label: string;
  value: string;
  icon: IconType;
  iconClassName: string;
};

const SummaryCard = ({ label, value, icon: Icon, iconClassName }: Card) => (
  <Wrapper className="flex flex-col gap-1.5">
    <div className="flex items-center gap-2 text-sm text-zinc-400">
      <Icon size={20} className={iconClassName} />
      {label}
    </div>

    <span className="text-2xl font-bold text-white">{value}</span>
  </Wrapper>
);

export const SummaryCards = ({ totals }: Props) => {
  const cards: Card[] = [
    {
      label: "Entregas concluídas",
      value: String(totals.deliveredOrdersCount),
      icon: MdCheckCircle,
      iconClassName: "text-amber-500",
    },
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <SummaryCard key={card.label} {...card} />
      ))}
    </div>
  );
};
