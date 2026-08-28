import { Wrapper } from "@components";
import type { IconType } from "react-icons";

export type SummaryCardProps = {
  label: string;
  value: string;
  icon: IconType;
  iconClassName: string;
  hint?: string;
};

export const SummaryCard = ({
  label,
  value,
  icon: Icon,
  iconClassName,
  hint,
}: SummaryCardProps) => (
  <Wrapper className="flex flex-col gap-1.5">
    <div className="flex items-center gap-2 text-sm text-zinc-400">
      <Icon size={20} className={iconClassName} />
      {label}
    </div>

    <span className="text-2xl font-bold text-white">{value}</span>

    {hint && <span className="text-xs text-zinc-500">{hint}</span>}
  </Wrapper>
);
