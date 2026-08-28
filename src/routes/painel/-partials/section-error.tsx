import { Wrapper } from "@components";

export const SectionError = () => (
  <Wrapper className="min-h-96 flex flex-col items-center justify-center gap-2">
    <span className="text-red-500 font-medium">Não foi possível carregar</span>

    <span className="text-red-500 text-sm">
      Verifique sua conexão e tente novamente
    </span>
  </Wrapper>
);
