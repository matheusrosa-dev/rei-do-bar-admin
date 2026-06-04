import { PageWrapper } from "@components";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/products/create/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageWrapper title="Criar produto" goBackTo="/products">
      <form>aaa</form>
    </PageWrapper>
  );
}
