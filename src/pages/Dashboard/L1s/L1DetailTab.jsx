import dayjs from "dayjs";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

const fmtTime = (timestamp) =>
  new Date(Number(timestamp)).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const ChartTooltip = ({ active, payload, label }) => {
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

const fmtNum = (val) => {
  if (!val || val === "0") return "–";
  const n = parseInt(val, 10);
  if (isNaN(n)) return val;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString();
};

const truncateId = (id = "") => (id.length > 14 ? `${id.slice(0, 14)}…` : id);

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 px-5 py-2.5 border-b border-gray-800/60 last:border-b-0">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="text-xs font-mono text-gray-200 text-right truncate">
      {value}
    </span>
  </div>
);

const StatCard = ({ label, value, delta, accent }) => (
  <div className="relative bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
    <div className="h-[3px] w-full" style={{ backgroundColor: accent }} />
    <div className="p-4">
      <div className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-2">
        {label}
      </div>
      <div className="text-2xl font-bold text-white tracking-tight">
        {value}
      </div>
      {delta && (
        <div className="text-[11px] text-green-400 mt-1">↑ {delta}</div>
      )}
    </div>
  </div>
);

export default function L1DetailTab({ chain, chainType, chainId }) {
  const dispatch = useDispatch();
  const { orbitDetail, dashboard, metricsHistory, metricsHistoryLoading } =
    useSelector((s) => s.orbit);

  useEffect(() => {
    if (chainId) {
      dispatch.orbit.handleGetOrbitDetail({ chainId });
    }
  }, [dispatch, chainId]);

  useEffect(() => {
    if (!chainId) return;
    const fetchMetricsHistory = () => {
      const end = Date.now();
      const start = end - TWENTY_FOUR_HOURS_MS;
      dispatch.orbit.handleGetMetricsHistory({
        metrics: ["tps"],
        start: String(start),
        end: String(end),
        type: chainType ?? "orbit",
        chainId,
      });
    };

    fetchMetricsHistory();
    const interval = setInterval(fetchMetricsHistory, 10000);
    return () => clearInterval(interval);
  }, [dispatch, chainType, chainId]);

  const chartData = useMemo(() => {
    return (metricsHistory ?? [])
      .filter((m) => m?.metric === "tps")
      .map((m) => ({
        timestamp: Number(m?.timestamp),
        time: fmtTime(m?.timestamp),
        value: parseFloat(m?.value) || 0,
      }))
      .sort((a, b) => a?.timestamp - b?.timestamp);
  }, [metricsHistory]);
  const hasChartData = chartData?.length > 0;

  const stats = [
    {
      label: "TPS",
      value: dashboard?.current_tps ?? chain?.tps ?? "0",
      accent: "#3b82f6",
    },
    {
      label: "Total Addresses",
      value: fmtNum(dashboard?.total_accounts ?? chain?.address_count),
      accent: "#22c55e",
    },
    {
      label: "Total Transactions",
      value: fmtNum(dashboard?.total_transactions ?? chain?.transaction_count),
      accent: "#3b82f6",
    },
    {
      label: "Total Contracts",
      value: fmtNum(
        dashboard?.total_contracts ?? chain?.total_deployed_contracts,
      ),
      accent: "#f59e0b",
    },
  ];

  // const displayName = orbitDetail?.name ?? chain?.name;

  // const subnetBlockchains = [
  //   {
  //     name: displayName,
  //     chainId: chainId,
  //     vmId: "srExXiWaHuhNyGwPUi444…",
  //   },
  //   {
  //     name: `${displayName} Testnet`,
  //     chainId: chainId ? String(Number(chainId) + 1) : "—",
  //     vmId: "qLXMev7yAYf7XT3JR3…",
  //   },
  // ];

  return (
    <div className="px-5 py-5 grid grid-cols-1 xl:grid-cols-2 gap-4">
      {/* Left column */}
      <div className="space-y-4">
        <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
          <InfoRow
            label="Subnet ID"
            value={truncateId(orbitDetail?.orbit_id ?? chain?.orbit_id)}
          />
          <InfoRow label="VM type" value={orbitDetail?.vm_type ?? "—"} />
          <InfoRow
            label="Chain ID"
            value={orbitDetail?.chain_id ?? chainId ?? "—"}
          />
          <InfoRow
            label="Created"
            value={dayjs(orbitDetail?.created_at).fromNow()}
          />
          <InfoRow
            label="Description"
            value={
              orbitDetail?.description ??
              `${chainType ?? "orbit"} L1 registered on the network.`
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-4">
        <div className="bg-[#0B111D] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
              TPS — Live
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
              Real-time
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            </span>
          </div>

          {metricsHistoryLoading && !hasChartData ? (
            <div className="h-[140px] flex items-center">
              <div className="w-full h-[100px] bg-gray-800/60 animate-pulse rounded-lg" />
            </div>
          ) : !hasChartData ? (
            <div className="h-[140px] flex flex-col items-center justify-center gap-2 w-full">
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
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart
                data={chartData}
                margin={{ top: 4, right: 4, left: 4, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="detailTxGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <YAxis hide domain={["dataMin", "dataMax"]} />
                <Tooltip
                  content={<ChartTooltip />}
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
                  fill="url(#detailTxGrad)"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: "#0B111D",
                    stroke: "#3b82f6",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
              Chain Info — L1 Blockchains
            </span>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-800/60">
                <th className="text-left px-5 py-2 text-gray-500 font-medium">
                  Chain Name
                </th>
                <th className="text-left px-3 py-2 text-gray-500 font-medium">
                  Chain ID
                </th>
                <th className="text-left px-3 py-2 text-gray-500 font-medium">
                  VM ID
                </th>
              </tr>
            </thead>
            <tbody>
              {subnetBlockchains.map((b, i) => (
                <tr
                  key={b.chainId ?? i}
                  className={`border-b border-gray-800/40 hover:bg-white/[0.02] transition-colors ${
                    i === subnetBlockchains.length - 1 ? "border-0" : ""
                  }`}
                >
                  <td className="px-5 py-2.5 text-gray-200 font-medium">
                    {b.name}
                  </td>
                  <td className="px-3 py-2.5 text-gray-300">{b.chainId}</td>
                  <td className="px-3 py-2.5 text-gray-400 font-mono">
                    {b.vmId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}

        {/* <div className="bg-[#0B111D] border border-gray-800 rounded-xl p-4">
          <div className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-3">
            Blockchains On Subnet
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {subnetBlockchains.map((b, i) => (
              <span
                key={b.chainId ?? i}
                className="px-3 py-1.5 rounded-lg border border-gray-700 bg-[#111827] text-xs text-gray-200"
              >
                {b.name} ({b.chainId})
              </span>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}
