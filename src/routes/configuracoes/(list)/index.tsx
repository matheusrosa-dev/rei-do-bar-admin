import { useSettingsService } from "@services";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { SettingsPanel } from "./-partials";
import {
  PageError,
  PageLoading,
  PageWrapper,
  RefetchButton,
} from "@components";

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

  const headerContent = () => (
    <RefetchButton
      onRefetch={settingsQuery.refetch}
      isRefetching={settingsQuery.isRefetching}
    />
  );

  if (settingsQuery.isLoading) {
    return <PageLoading title="Configurações" />;
  }

  if (settingsQuery.isError || !settings) {
    return <PageError title="Configurações" headerContent={headerContent} />;
  }

  return (
    <PageWrapper title="Configurações" headerContent={headerContent}>
      <SettingsPanel settings={settings} />
    </PageWrapper>
  );
}
