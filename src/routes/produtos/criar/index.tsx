import { PageWrapper } from "@components";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/produtos/criar/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageWrapper title="Criar produto" goBackTo="/produtos">
      <form>aaa</form>
    </PageWrapper>
  );
}
