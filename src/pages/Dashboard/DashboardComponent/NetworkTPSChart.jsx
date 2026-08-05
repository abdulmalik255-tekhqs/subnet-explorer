import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
const REFRESH_INTERVAL_MS = 10000;

const fmtTime = (timestamp) =>
  new Date(Number(timestamp)).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0a1220] border border-blue-500/40 rounded-lg px-3 py-2 text-xs shadow-xl">
      <div className="text-gray-500 mb-0.5">{label}</div>
      <div className="text-blue-400 font-bold text-sm">
        {payload[0].value?.toLocaleString()} TPS
      </div>
    </div>
  );
};

export default function NetworkTPSChart({ type = "primary", chainId }) {
  const dispatch = useDispatch();
  const { metricsHistory, metricsHistoryLoading } = useSelector((s) => s.orbit);
  useEffect(() => {
    const fetchMetricsHistory = () => {
      const end = Date.now();
      const start = end - TWENTY_FOUR_HOURS_MS;
      dispatch.orbit.handleGetMetricsHistory({
        metrics: ["tps"],
        start: String(start),
        end: String(end),
        type,
        chainId,
      });
    };

    fetchMetricsHistory();
    const intervalId = setInterval(fetchMetricsHistory, REFRESH_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [dispatch, type, chainId]);

  const chartData = useMemo(() => {
    const earliestAllowedTimestamp = Date.now() - TWENTY_FOUR_HOURS_MS;

    return (metricsHistory ?? [])
      .filter(
        (metric) =>
          metric?.metric === "tps" &&
          Number(metric?.timestamp) >= earliestAllowedTimestamp,
      )
      .map((m) => ({
        timestamp: Number(m?.timestamp),
        time: fmtTime(m?.timestamp),
        value: parseFloat(m?.value) || 0,
      }))
      .sort((a, b) => a?.timestamp - b?.timestamp);
  }, [metricsHistory]);

  const hasData = chartData?.length > 0;
  return (
    <div className="bg-[#0B1220] border border-gray-800/60 rounded-2xl p-4 shadow-2xl shadow-black/50 w-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] text-blue-400/80 font-bold uppercase tracking-widest">
          Network TPS — 24H
        </span>
      </div>

      {metricsHistoryLoading ? (
        <div className="h-[180px] flex items-center">
          <div className="w-full h-[120px] bg-gray-800/60 animate-pulse rounded-lg" />
        </div>
      ) : !hasData ? (
        <div className="h-[180px] flex flex-col items-center justify-center gap-2 w-full">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#374151"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <span className="text-xs text-gray-600 font-medium">
            No data available
          </span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{ top: 4, right: 4, left: 4, bottom: 0 }}
          >
            <defs>
              <linearGradient id="tpsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide />
            <YAxis hide domain={["dataMin", "dataMax"]} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#3b82f6",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#tpsGrad)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#0B1220",
                stroke: "#3b82f6",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
