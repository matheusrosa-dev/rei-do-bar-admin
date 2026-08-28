import { Wrapper } from "@components";

export const SectionLoading = () => (
  <Wrapper className="min-h-96 flex items-center justify-center">
    <div className="size-8 rounded-full border-2 border-zinc-700 border-t-amber-500 animate-spin" />
  </Wrapper>
);
