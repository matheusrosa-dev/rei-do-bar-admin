import { Wrapper } from "@components";
import { formatCompactPrice } from "@shared/helpers/number";
import type { RevenuePoint } from "@shared/services/dashboard/types";
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
import { ChartTooltip } from "../chart-tooltip";
import { CHART_COLORS, CHART_HEIGHT, formatSeriesValue } from "./-helpers";

type Props = {
  data: RevenuePoint[];
};

export const RevenueChart = ({ data }: Props) => {
  return (
    <Wrapper>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="text-white font-bold text-lg tracking-tight">
          Faturamento ao longo do tempo
        </h4>

        {data.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-amber-500" />
              Faturamento
            </span>

            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-green-400" />
              Desconto em cupons
            </span>

            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-zinc-300" />
              Pedidos entregues
            </span>
          </div>
        )}
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-500">
          <MdInbox size={32} />
          <span className="text-sm">Nenhuma entrega no período.</span>
        </div>
      ) : (
        <div
          role="img"
          aria-label="Faturamento, desconto em cupons e pedidos entregues ao longo do tempo"
        >
          <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
            <LineChart data={data} margin={{ top: 16, right: 8 }}>
              <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />

              <XAxis
                dataKey="label"
                minTickGap={24}
                stroke={CHART_COLORS.axis}
                tick={{ fontSize: 12 }}
              />

              <YAxis
                yAxisId="money"
                width="auto"
                stroke={CHART_COLORS.axis}
                tick={{ fontSize: 12 }}
                tickFormatter={formatCompactPrice}
              />

              <YAxis
                yAxisId="count"
                orientation="right"
                allowDecimals={false}
                width="auto"
                stroke={CHART_COLORS.axis}
                tick={{ fontSize: 12 }}
              />

              <Tooltip
                cursor={{ stroke: CHART_COLORS.cursor }}
                content={(props) => (
                  <ChartTooltip {...props} formatValue={formatSeriesValue} />
                )}
              />

              <Line
                yAxisId="money"
                type="monotone"
                dataKey="revenue"
                name="Faturamento"
                stroke={CHART_COLORS.revenue}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />

              <Line
                yAxisId="money"
                type="monotone"
                dataKey="couponDiscount"
                name="Desconto em cupons"
                stroke={CHART_COLORS.couponDiscount}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />

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
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Wrapper>
  );
};
