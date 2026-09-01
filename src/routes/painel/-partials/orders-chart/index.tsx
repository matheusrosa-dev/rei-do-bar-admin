import { Wrapper } from "@components";
import type { SeriesPoint } from "@shared/services/dashboard/types";
import { useState } from "react";
import { MdInbox } from "react-icons/md";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartLegend, formatChartLabel } from "../chart-legend";
import { ChartTooltip } from "../chart-tooltip";
import {
  CHART_COLORS,
  CHART_HEIGHT,
  formatSeriesValue,
  SERIES,
  type SeriesKey,
} from "./-helpers";

type Props = {
  data: SeriesPoint[];
};

export const OrdersChart = ({ data }: Props) => {
  const [hiddenSeries, setHiddenSeries] = useState<SeriesKey[]>([]);

  const isVisible = (key: SeriesKey) => !hiddenSeries.includes(key);

  const hasCountAxis = SERIES.some(({ key }) => isVisible(key));

  const onToggleSeries = (key: SeriesKey) => {
    setHiddenSeries((previous) =>
      previous.includes(key)
        ? previous.filter((series) => series !== key)
        : [...previous, key],
    );
  };

  return (
    <Wrapper>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="text-white font-bold text-lg tracking-tight">
          Pedidos ao longo do tempo
        </h4>

        {data.length > 0 && (
          <ChartLegend
            series={SERIES}
            hiddenSeries={hiddenSeries}
            onToggleSeries={onToggleSeries}
          />
        )}
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-500">
          <MdInbox size={32} />
          <span className="text-sm">Nenhuma entrega no período.</span>
        </div>
      ) : (
        <div role="img" aria-label={formatChartLabel(SERIES, hiddenSeries)}>
          <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
            <LineChart data={data} margin={{ top: 16, right: 8 }}>
              <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />

              <XAxis
                dataKey="label"
                minTickGap={24}
                stroke={CHART_COLORS.axis}
                tick={{ fontSize: 12 }}
              />

              {hasCountAxis && (
                <YAxis
                  yAxisId="count"
                  allowDecimals={false}
                  width="auto"
                  stroke={CHART_COLORS.axis}
                  tick={{ fontSize: 12 }}
                />
              )}

              <Tooltip
                cursor={{ stroke: CHART_COLORS.cursor }}
                content={(props) => (
                  <ChartTooltip {...props} formatValue={formatSeriesValue} />
                )}
              />

              {isVisible("deliveredOrdersCount") && (
                <Line
                  yAxisId="count"
                  type="monotone"
                  dataKey="deliveredOrdersCount"
                  name="Pedidos entregues"
                  stroke={CHART_COLORS.deliveredOrdersCount}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              )}

              {isVisible("firstDeliveredOrdersCount") && (
                <Line
                  yAxisId="count"
                  type="monotone"
                  dataKey="firstDeliveredOrdersCount"
                  name="Primeiros pedidos"
                  stroke={CHART_COLORS.firstDeliveredOrdersCount}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              )}

              {isVisible("redeemedCouponOrdersCount") && (
                <Line
                  yAxisId="count"
                  type="monotone"
                  dataKey="redeemedCouponOrdersCount"
                  name="Pedidos com cupom"
                  stroke={CHART_COLORS.redeemedCouponOrdersCount}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Wrapper>
  );
};
