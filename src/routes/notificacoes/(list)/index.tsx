import { useNotificationsService } from "@services";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Filters, PushNotificationModal, Table } from "./-partials";
import { Button, PageWrapper } from "@components";
import { validateSearch } from "./-helpers";
import { useState } from "react";

export const Route = createFileRoute("/notificacoes/(list)/")({
  validateSearch,
  component: Index,
});

const LIMIT = 50;

function Index() {
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const { page = 1, target, status } = Route.useSearch();

  const { getNotifications } = useNotificationsService();

  const { data: notifications, ...notificationsQuery } = useQuery({
    queryKey: [getNotifications.key, page, target, status],
    queryFn: () => getNotifications.fn({ page, limit: LIMIT, target, status }),
    retry: false,
  });

  return (
    <PageWrapper
      title="Notificações"
      headerContent={() => (
        <Button onClick={() => setIsNotificationModalOpen(true)}>
          Enviar notificação
        </Button>
      )}
    >
      <div className="mb-4">
        <Filters
          onRefetch={notificationsQuery.refetch}
          isRefetching={notificationsQuery.isRefetching}
        />
      </div>

      <Table
        data={notifications?.items ?? []}
        meta={notifications?.meta}
        limit={LIMIT}
        isLoading={notificationsQuery.isLoading}
        isError={notificationsQuery.isError}
      />

      <PushNotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />
    </PageWrapper>
  );
}
