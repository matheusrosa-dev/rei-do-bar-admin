import { twMerge } from "tailwind-merge";

export type Series<Key extends string> = {
  key: Key;
  label: string;
  dotClassName: string;
};

const EMPTY_CHART_LABEL = "Nenhuma série exibida";

export const formatChartLabel = <Key extends string>(
  series: Series<Key>[],
  hiddenSeries: Key[],
) => {
  const visibleLabels = series
    .filter(({ key }) => !hiddenSeries.includes(key))
    .map(({ label }) => label);

  if (visibleLabels.length === 0) return EMPTY_CHART_LABEL;

  return `${visibleLabels.join(", ")} ao longo do tempo`;
};

type Props<Key extends string> = {
  series: Series<Key>[];
  hiddenSeries: Key[];
  onToggleSeries: (key: Key) => void;
};

export const ChartLegend = <Key extends string>({
  series,
  hiddenSeries,
  onToggleSeries,
}: Props<Key>) => (
  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-zinc-400">
    {series.map(({ key, label, dotClassName }) => {
      const isVisible = !hiddenSeries.includes(key);

      return (
        <button
          key={key}
          type="button"
          aria-pressed={isVisible}
          onClick={() => onToggleSeries(key)}
          className={twMerge(
            "flex items-center gap-1.5 rounded-lg px-1 py-0.5 cursor-pointer outline-none transition-opacity duration-150 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900",
            !isVisible && "opacity-50 hover:opacity-70",
          )}
        >
          <span className={twMerge("size-2.5 rounded-full", dotClassName)} />
          {label}
        </button>
      );
    })}
  </div>
);
