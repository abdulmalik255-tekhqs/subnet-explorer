import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const fmtDate = (iso) => {
  if (!iso) return "";
  const [, m, d] = iso.split("-");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[parseInt(m, 10) - 1]} ${parseInt(d, 10)}`;
};

const fmtNum = (val) => {
  if (!val && val !== 0) return "—";
  const n = parseFloat(val);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0a1612] border border-[#2dd4a7]/40 rounded-lg px-3 py-2 text-xs shadow-xl">
      <div className="text-gray-500 mb-0.5">{label}</div>
      <div className="text-[#2dd4a7] font-bold text-sm">
        {payload[0].value?.toLocaleString()} txns
      </div>
    </div>
  );
};

export default function TransactionChart({ type = "primary" }) {
  const dispatch = useDispatch();
  const { txHistory, txHistoryLoading } = useSelector((s) => s.orbit);

  useEffect(() => {
    dispatch.orbit.handleGetLast14DaysTxs({ type });
  }, [dispatch, type]);

  const dailyTxs = txHistory?.dailyTxs ?? [];
  const totalTxs = txHistory?.totalTxs ?? null;
  const hasData = dailyTxs.length > 0;

  const chartData = dailyTxs.map((d) => ({
    date: fmtDate(d.date),
    txns: parseInt(d.txCount, 10) || 0,
  }));

  return (
    <div className="bg-[#111827] border border-gray-800/60 rounded-2xl p-4 shadow-2xl shadow-black/50 w-full lg:w-1/2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">
          Transaction Count —{" "}
          <span className="text-blue-500">Last 14 Days</span>
        </span>
        {totalTxs && (
          <span className="text-[11px] font-bold text-gray-400 tracking-wider">
            Total: <span className="text-white">{fmtNum(totalTxs)}</span>
          </span>
        )}
      </div>

      {/* Chart area */}
      {txHistoryLoading ? (
        <div className="h-[180px] flex items-center">
          <div className="w-full h-[120px] bg-gray-800/60 animate-pulse rounded-lg" />
        </div>
      ) : !hasData ? (
        <div className="h-[130px] flex flex-col items-center justify-center gap-2 w-full">
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
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart
            data={chartData}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="txGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2dd4a7" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#2dd4a7" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            {/* <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1f2937"
              vertical={false}
            /> */}
            {/* <XAxis
              dataKey="date"
              tick={{ fill: "#4B5563", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            /> */}
            {/* <YAxis
              tick={{ fill: "#4B5563", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={fmtNum}
            /> */}

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#2dd4a7",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />

            <Area
              type="monotone"
              dataKey="txns"
              stroke="#2dd4a7"
              strokeWidth={1.8}
              fill="url(#txGrad)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#0d1f1a",
                stroke: "#2dd4a7",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
