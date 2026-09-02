import { EMPTY_VALUE } from "@shared/helpers/number";
import type { ReactNode } from "react";
import type { TooltipContentProps } from "recharts";

export type FormatValue = (value: number | null, dataKey: string) => string;

export type TooltipFooter = {
  label: string;
  value: ReactNode;
};

type Props = TooltipContentProps & {
  formatValue?: FormatValue;
  footer?: TooltipFooter | null;
};

const toValue = (value: unknown) =>
  value === null || value === undefined ? null : Number(value);

const formatRawValue: FormatValue = (value) => value?.toString() ?? EMPTY_VALUE;

export const ChartTooltip = ({
  active,
  label,
  payload,
  formatValue = formatRawValue,
  footer,
}: Props) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 shadow-xl">
      <span className="text-xs font-semibold text-white">{label}</span>

      <div className="flex flex-col gap-1 mt-1.5">
        {payload.map((entry) => (
          <div
            key={entry.graphicalItemId}
            className="flex items-center gap-2 text-xs text-zinc-400"
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

      {footer ? (
        <div className="mt-1.5 flex items-center gap-2 border-t border-white/10 pt-1.5 text-xs text-zinc-400">
          {footer.label}
          <span className="ml-auto font-semibold text-white">
            {footer.value}
          </span>
        </div>
      ) : null}
    </div>
  );
};
