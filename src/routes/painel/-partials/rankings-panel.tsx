import { useDashboardService } from "@services";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { twMerge } from "tailwind-merge";
import { fromDateTimeParam } from "../-helpers";
import { CouponsRankingCard } from "./coupons-ranking-card";
import { ProductsRankingCard } from "./products-ranking-card";
import { SectionError } from "./section-error";
import { SectionLoading } from "./section-loading";

export const RankingsPanel = () => {
  const { startDate, endDate } = useSearch({ from: "/painel/" });

  const { getRankings } = useDashboardService();

  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: [getRankings.key, startDate, endDate],
    queryFn: () =>
      getRankings.fn({
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
        "grid grid-cols-1 xl:grid-cols-2 gap-4 transition-opacity duration-200",
        isPlaceholderData && "opacity-60",
      )}
    >
      <ProductsRankingCard data={data.products} />

      <CouponsRankingCard data={data.coupons} />
    </div>
  );
};
