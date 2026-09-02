import { Wrapper } from "@components";
import type { DeliveryPersonPerformance } from "@shared/services/dashboard/types";
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
  formatName,
  getChartHeight,
  getDeliveryPersonFooters,
} from "./-helpers";
import { ChartTooltip } from "../chart-tooltip";

type Props = {
  data: DeliveryPersonPerformance[];
};

export const DeliveryPersonsChart = ({ data }: Props) => {
  return (
    <Wrapper>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="text-white font-bold text-lg tracking-tight">
          Desempenho por entregador
        </h4>

        {data.length > 0 && (
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-amber-500" />
              Entregues
            </span>

            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-red-500" />
              Falhas na entrega
            </span>
          </div>
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
          aria-label="Pedidos entregues e falhas na entrega por entregador"
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
                    footer={getDeliveryPersonFooters(
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
              />

              <Bar
                dataKey="cancelledOrdersCount"
                name="Falhas na entrega"
                fill={CHART_COLORS.cancelled}
                radius={[0, 4, 4, 0]}
                maxBarSize={22}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Wrapper>
  );
};
