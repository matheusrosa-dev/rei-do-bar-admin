import { EMPTY_VALUE } from "@shared/helpers/number";
import type { ReactNode } from "react";
import type { TooltipContentProps } from "recharts";
import { twMerge } from "tailwind-merge";

export type FormatValue = (value: number | null, dataKey: string) => string;

export type TooltipFooter = {
  label: string;
  value: ReactNode;
  valueClassName?: string;
};

export type TooltipFooterGroup = TooltipFooter[];

type Props = TooltipContentProps & {
  formatValue?: FormatValue;
  footerGroups?: TooltipFooterGroup[] | null;
};

const toValue = (value: unknown) =>
  value === null || value === undefined ? null : Number(value);

const formatRawValue: FormatValue = (value) => value?.toString() ?? EMPTY_VALUE;

export const ChartTooltip = ({
  active,
  label,
  payload,
  formatValue = formatRawValue,
  footerGroups,
}: Props) => {
  if (!active || !payload?.length) return null;

  const groups = (footerGroups ?? []).filter((group) => group.length > 0);

  return (
    <div className="rounded-lg border border-white/10 bg-zinc-800 px-4 py-2.5 shadow-xl">
      <span className="text-sm font-semibold text-white">{label}</span>

      <div className="flex flex-col gap-1.5 mt-2">
        {payload.map((entry) => (
          <div
            key={entry.graphicalItemId}
            className="flex items-center gap-2 text-sm text-zinc-400"
          >
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            {entry.name}
            <span className="ml-auto font-semibold text-white">
              {formatValue(toValue(entry.value), String(entry.dataKey))}
            </span>
          </div>
        ))}
      </div>

      {groups.map((group) => (
        <div
          key={group[0].label}
          className="mt-2 flex flex-col gap-1.5 border-t border-white/10 pt-2"
        >
          {group.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 text-sm text-zinc-400"
            >
              {item.label}
              <span
                className={twMerge(
                  "ml-auto font-semibold text-white",
                  item.valueClassName,
                )}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
