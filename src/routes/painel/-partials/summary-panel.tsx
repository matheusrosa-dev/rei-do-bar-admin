import { useDashboardService } from "@services";
import { formatPercentage, formatPrice } from "@shared/helpers/number";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import {
  MdCancel,
  MdCheckCircle,
  MdConfirmationNumber,
  MdEmojiEvents,
  MdLocalOffer,
  MdPayments,
  MdReceiptLong,
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
        "grid grid-cols-1 sm:grid-cols-2 gap-4 transition-opacity duration-200",
        isPlaceholderData && "opacity-60",
      )}
    >
      <SummaryCard
        label="Pedidos entregues"
        value={String(data.deliveredOrdersCount)}
        icon={MdCheckCircle}
        iconClassName="text-amber-500"
      />

      <SummaryCard
        label="Pedidos cancelados"
        value={String(data.cancelledOrdersCount)}
        icon={MdCancel}
        iconClassName="text-red-500"
      />

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

      <SummaryCard
        label="Faturamento"
        value={formatPrice(data.revenue)}
        icon={MdPayments}
        iconClassName="text-amber-500"
      />
    </div>
  );
};
