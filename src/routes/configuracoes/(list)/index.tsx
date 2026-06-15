import { useSettingsService } from "@services";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Table } from "./-partials";
import { PageWrapper, RefetchButton } from "@components";

export const Route = createFileRoute("/configuracoes/(list)/")({
  component: Index,
});

function Index() {
  const { getSettings } = useSettingsService();

  const { data: settings, ...settingsQuery } = useQuery({
    queryKey: [getSettings.key],
    queryFn: () => getSettings.fn(),
    retry: false,
  });

  return (
    <PageWrapper title="Configurações">
      <div className="flex mb-4 justify-end">
        <RefetchButton
          onRefetch={settingsQuery.refetch}
          isRefetching={settingsQuery.isRefetching}
        />
      </div>

      <Table
        data={settings ?? []}
        isLoading={settingsQuery.isLoading}
        isError={settingsQuery.isError}
      />
    </PageWrapper>
  );
}
