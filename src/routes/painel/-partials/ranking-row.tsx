import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  position: number;
  title: ReactNode;
  meta: string;
  value: string;
  unit: string;
  media?: ReactNode;
  metaClassName?: string;
};

export const RankingRow = ({
  position,
  title,
  meta,
  value,
  unit,
  media,
  metaClassName,
}: Props) => (
  <li className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
    <span className="w-4 shrink-0 text-xs font-semibold text-zinc-500">
      {position}
    </span>

    {media}

    <div className="flex flex-col min-w-0 gap-0.5">
      {title}

      <span className={twMerge("text-xs text-zinc-500", metaClassName)}>
        {meta}
      </span>
    </div>

    <div className="flex flex-col items-end shrink-0 ml-auto">
      <span className="text-lg font-bold text-white">{value}</span>

      <span className="text-xs text-zinc-500">{unit}</span>
    </div>
  </li>
);
