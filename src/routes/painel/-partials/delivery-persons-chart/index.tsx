import { Wrapper } from "@components";
import type { DeliveryPersonPerformance } from "@shared/services/dashboard/types";
import { useState } from "react";
import { MdInbox } from "react-icons/md";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CHART_COLORS,
  formatDeliveryPersonChartLabel,
  formatName,
  getChartHeight,
  getDeliveryPersonFooterGroups,
  SERIES,
  type SeriesKey,
} from "./-helpers";
import { ChartLegend } from "../chart-legend";
import { ChartTooltip } from "../chart-tooltip";

type Props = {
  data: DeliveryPersonPerformance[];
};

export const DeliveryPersonsChart = ({ data }: Props) => {
  const [hiddenSeries, setHiddenSeries] = useState<SeriesKey[]>([]);

  const isVisible = (key: SeriesKey) => !hiddenSeries.includes(key);

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
          Desempenho por entregador
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
          <span className="text-sm">Nenhum entregador cadastrado.</span>
        </div>
      ) : (
        <div
          role="img"
          aria-label={formatDeliveryPersonChartLabel(hiddenSeries)}
        >
          <ResponsiveContainer
            width="100%"
            height={getChartHeight(data.length)}
          >
            <BarChart data={data} layout="vertical" barCategoryGap={12}>
              <CartesianGrid horizontal={false} stroke={CHART_COLORS.grid} />

              <XAxis
                type="number"
                allowDecimals={false}
                stroke={CHART_COLORS.axis}
                tick={{ fontSize: 12 }}
              />

              <YAxis
                type="category"
                dataKey="name"
                width="auto"
                stroke={CHART_COLORS.axis}
                tick={{ fontSize: 12 }}
                tickFormatter={formatName}
              />

              <Tooltip
                cursor={{ fill: CHART_COLORS.cursor }}
                content={(props) => (
                  <ChartTooltip
                    {...props}
                    footerGroups={getDeliveryPersonFooterGroups(
                      props.payload?.[0]?.payload,
                    )}
                  />
                )}
              />

              <Bar
                dataKey="deliveredOrdersCount"
                name="Entregues"
                fill={CHART_COLORS.delivered}
                radius={[0, 4, 4, 0]}
                maxBarSize={22}
                hide={!isVisible("deliveredOrdersCount")}
              />

              <Bar
                dataKey="volunteeredDeliveriesCount"
                name="Voluntárias"
                fill={CHART_COLORS.volunteered}
                radius={[0, 4, 4, 0]}
                maxBarSize={22}
                hide={!isVisible("volunteeredDeliveriesCount")}
              />

              <Bar
                dataKey="cancelledOrdersCount"
                name="Falhas na entrega"
                fill={CHART_COLORS.cancelled}
                radius={[0, 4, 4, 0]}
                maxBarSize={22}
                hide={!isVisible("cancelledOrdersCount")}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Wrapper>
  );
};
