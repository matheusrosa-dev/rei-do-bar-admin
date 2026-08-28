import type { TooltipContentProps } from "recharts";

type Props = TooltipContentProps & {
  formatValue?: (value: number, dataKey: string) => string;
};

export const ChartTooltip = ({
  active,
  label,
  payload,
  formatValue = String,
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
              {formatValue(Number(entry.value), String(entry.dataKey))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
