import { Button, PageWrapper } from "@components";
import { useCouponsService } from "@services";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { situationToQuery, validateSearch } from "./-helpers";
import { CouponModal, Filters, Table } from "./-partials";

export const Route = createFileRoute("/cupons/(list)/")({
  validateSearch,
  component: Index,
});

const LIMIT = 10;

function Index() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    page = 1,
    searchTerm,
    isActive,
    situation,
    sortKey,
    sortDirection,
  } = Route.useSearch();

  const { getCoupons } = useCouponsService();

  const { data: coupons, ...couponsQuery } = useQuery({
    queryKey: [
      getCoupons.key,
      page,
      searchTerm,
      isActive,
      situation,
      sortKey,
      sortDirection,
    ],
    queryFn: () =>
      getCoupons.fn({
        page,
        limit: LIMIT,
        searchTerm,
        isActive,
        ...situationToQuery(situation),
        sortKey,
        sortDirection,
      }),
    retry: false,
  });

  return (
    <PageWrapper
      title="Cupons"
      headerContent={() => (
        <Button onClick={() => setIsCreateModalOpen(true)}>Criar cupom</Button>
      )}
    >
      <div className="mb-4">
        <Filters
          onRefetch={couponsQuery.refetch}
          isRefetching={couponsQuery.isRefetching}
        />
      </div>

      <Table
        data={coupons?.items ?? []}
        meta={coupons?.meta}
        limit={LIMIT}
        isLoading={couponsQuery.isLoading}
        isError={couponsQuery.isError}
      />

      <CouponModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </PageWrapper>
  );
}
