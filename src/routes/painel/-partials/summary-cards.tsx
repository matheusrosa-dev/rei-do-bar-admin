import { Wrapper } from "@components";
import type { DeliveryPersonsPerformanceTotals } from "@shared/services/dashboard/types";
import type { IconType } from "react-icons";
import { MdCancel, MdCheckCircle, MdLocalShipping } from "react-icons/md";

type Props = {
  totals: DeliveryPersonsPerformanceTotals;
};

type Card = {
  label: string;
  value: number;
  icon: IconType;
  iconClassName: string;
};

export const SummaryCards = ({ totals }: Props) => {
  const cards: Card[] = [
    {
      label: "Total de pedidos",
      value: totals.totalOrdersCount,
      icon: MdLocalShipping,
      iconClassName: "text-zinc-400",
    },
    {
      label: "Entregas concluídas",
      value: totals.deliveredOrdersCount,
      icon: MdCheckCircle,
      iconClassName: "text-amber-500",
    },
    {
      label: "Pedidos cancelados após envio",
      value: totals.cancelledOrdersCount,
      icon: MdCancel,
      iconClassName: "text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map(({ label, value, icon: Icon, iconClassName }) => (
        <Wrapper key={label} className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Icon size={20} className={iconClassName} />
            {label}
          </div>

          <span className="text-2xl font-bold text-white">{value}</span>
        </Wrapper>
      ))}
    </div>
  );
};
