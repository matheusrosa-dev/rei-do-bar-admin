import { useDashboardService } from "@services";
import { formatMinutes } from "@shared/helpers/duration";
import { formatPercentage, formatPrice } from "@shared/helpers/number";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import {
  MdAvTimer,
  MdCancel,
  MdCheckCircle,
  MdConfirmationNumber,
  MdEmojiEvents,
  MdLocalOffer,
  MdGroupAdd,
  MdInventory2,
  MdPayments,
  MdPersonAddAlt1,
  MdReceiptLong,
  MdTrendingUp,
} from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { fromDateTimeParam } from "../-helpers";
import { SectionError } from "./section-error";
import { SectionLoading } from "./section-loading";
import { SummaryCard } from "./summary-card";

export const SummaryPanel = () => {
  const { startDate, endDate } = useSearch({ from: "/painel/" });

  const { getSummary } = useDashboardService();

  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: [getSummary.key, startDate, endDate],
    queryFn: () =>
      getSummary.fn({
        startDate: fromDateTimeParam(startDate),
        endDate: fromDateTimeParam(endDate),
      }),
    placeholderData: keepPreviousData,
    retry: false,
  });

  if (isLoading) return <SectionLoading />;

  if (isError || !data) return <SectionError />;

  return (
    <div
      className={twMerge(
        "flex flex-col gap-4 transition-opacity duration-200",
        isPlaceholderData && "opacity-60",
      )}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard
          label="Pedidos entregues"
          value={String(data.deliveredOrdersCount)}
          icon={MdCheckCircle}
          iconClassName="text-zinc-300"
        />

        <SummaryCard
          label="Falhas na entrega"
          value={String(data.failedDeliveriesCount)}
          icon={MdCancel}
          iconClassName="text-red-500"
        />

        <SummaryCard
          label="Tempo médio de entrega"
          value={formatMinutes(data.averageDeliveryMinutes)}
          icon={MdAvTimer}
          iconClassName="text-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard
          label="Faturamento"
          value={formatPrice(data.revenue)}
          icon={MdPayments}
          iconClassName="text-amber-500"
        />

        <SummaryCard
          label="Custo de reposição"
          value={formatPrice(data.restockCost)}
          icon={MdInventory2}
          iconClassName="text-amber-500"
        />

        <SummaryCard
          label="Lucro"
          value={formatPrice(data.profit)}
          icon={MdTrendingUp}
          iconClassName="text-amber-500"
          hint={`${formatPercentage(data.profitPercentage)} do faturamento`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SummaryCard
          label="Ticket médio"
          value={formatPrice(data.averageOrderValue)}
          icon={MdReceiptLong}
          iconClassName="text-violet-400"
        />

        <SummaryCard
          label="Maior pedido"
          value={formatPrice(data.highestOrderValue)}
          icon={MdEmojiEvents}
          iconClassName="text-violet-400"
        />

        <SummaryCard
          label="Pedidos com cupom"
          value={String(data.redeemedCouponOrdersCount)}
          icon={MdConfirmationNumber}
          iconClassName="text-green-400"
        />

        <SummaryCard
          label="Desconto em cupons"
          value={formatPrice(data.couponDiscount)}
          icon={MdLocalOffer}
          iconClassName="text-green-400"
          hint={`${formatPercentage(data.couponDiscountPercentage)} do faturamento bruto`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SummaryCard
          label="Clientes cadastrados"
          value={String(data.newCustomersCount)}
          icon={MdGroupAdd}
          iconClassName="text-sky-400"
        />

        <SummaryCard
          label="Primeiros pedidos"
          value={String(data.firstDeliveredOrdersCount)}
          icon={MdPersonAddAlt1}
          iconClassName="text-sky-400"
        />
      </div>
    </div>
  );
};
