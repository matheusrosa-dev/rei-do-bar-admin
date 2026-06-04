import { PageWrapper, type Props as PageWrapperProps } from "./page-wrapper";

export const PageLoading = (props: Omit<PageWrapperProps, "children">) => {
  return (
    <PageWrapper {...props}>
      <div className="flex-1 flex items-center justify-center">
        <div className="size-8 rounded-full border-2 border-zinc-700 border-t-amber-500 animate-spin" />
      </div>
    </PageWrapper>
  );
};
