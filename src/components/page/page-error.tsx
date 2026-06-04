import { PageWrapper, type Props as PageWrapperProps } from "./page-wrapper";

export const PageError = (props: Omit<PageWrapperProps, "children">) => {
  return (
    <PageWrapper {...props}>
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <span className="text-red-500 font-medium">
          Não foi possível carregar
        </span>
        <span className="text-red-500 text-sm">
          Verifique sua conexão e tente novamente
        </span>
      </div>
    </PageWrapper>
  );
};
