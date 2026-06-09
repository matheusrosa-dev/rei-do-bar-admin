import { PageError, PageLoading, PageWrapper } from "@components";
import { useCustomersService } from "@services";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Addresses, BasicData, Orders } from "./-partials";

export const Route = createFileRoute("/clientes/visualizar/$customerId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { customerId } = Route.useParams();
  const { getCustomerById } = useCustomersService();

  const { data: customer, ...customerQuery } = useQuery({
    queryKey: [getCustomerById.key, customerId],
    queryFn: () => getCustomerById.fn(customerId),
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (customerQuery.isLoading) {
    return <PageLoading title="Cliente" goBack />;
  }

  if (customerQuery.isError || !customer) {
    return <PageError title="Cliente" goBack />;
  }

  return (
    <PageWrapper title="Cliente" goBack>
      <div className="flex flex-col gap-4 max-w-4xl">
        <BasicData customer={customer} />
        <Addresses addresses={customer.addresses} />
        <Orders orders={customer.orders} />
      </div>
    </PageWrapper>
  );
}
