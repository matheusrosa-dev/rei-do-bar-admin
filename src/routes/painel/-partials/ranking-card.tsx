import { Wrapper } from "@components";
import type { ReactNode } from "react";
import { MdInbox } from "react-icons/md";

type Props = {
  title: string;
  isEmpty: boolean;
  emptyMessage: string;
  children: ReactNode;
};

export const RankingCard = ({
  title,
  isEmpty,
  emptyMessage,
  children,
}: Props) => (
  <Wrapper>
    <div className="flex flex-col gap-1.5">
      <h4 className="text-white font-bold text-lg tracking-tight">{title}</h4>
    </div>

    {isEmpty ? (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-500">
        <MdInbox size={32} />
        <span className="text-sm">{emptyMessage}</span>
      </div>
    ) : (
      <ul className="mt-4 flex flex-col divide-y divide-white/10">
        {children}
      </ul>
    )}
  </Wrapper>
);
