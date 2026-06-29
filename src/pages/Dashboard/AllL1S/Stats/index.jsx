import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { CheckCircle, ArrowUp, ArrowDown, Minus } from "@phosphor-icons/react";
import { tpsHistory, blockTimeHistory, txVolumeHistory, gasUsageHistory, validatorNodes } from "../demoData";

const StatCard = ({ label, value, sub, trend }) => (
  <div className="bg-[#0B111D] border border-gray-800 rounded-xl p-4">
    <div className="text-gray-400 text-xs mb-1">{label}</div>
    <div className="text-2xl font-bold text-white">{value}</div>
    {sub && <div className="text-gray-500 text-xs mt-1 flex items-center gap-1">
      {trend === "up" && <ArrowUp size={11} className="text-green-400" />}
      {trend === "down" && <ArrowDown size={11} className="text-red-400" />}
      {trend === "flat" && <Minus size={11} className="text-gray-500" />}
      {sub}
    </div>}
  </div>
);

const ChartCard = ({ title, children, height = 180 }) => (
  <div className="bg-[#0B111D] border border-gray-800 rounded-xl p-5">
    <div className="text-sm font-semibold text-white mb-4">{title}</div>
    <div style={{ height }}>{children}</div>
  </div>
);

const chartTooltipStyle = {
  contentStyle: { background: "#0F172A", border: "1px solid #1E293B", borderRadius: 8, fontSize: 11 },
  itemStyle: { color: "#CBD5E1" },
  labelStyle: { color: "#64748B" },
  cursor: { stroke: "#334155" },
};

const Stats = ({ chain }) => {
  const symbol = chain?.symbol || "TOKEN";

  const overallUptime = validatorNodes
    .reduce((acc, v) => acc + parseFloat(v.uptime), 0) / validatorNodes.length;

  return (
    <div className="px-6 py-5 space-y-5">
      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Current TPS"
          value={chain?.tps || 0}
          sub="Last 1 hour avg"
          trend="up"
        />
        <StatCard
          label="Avg Block Time"
          value={chain?.avgBlockTime || "—"}
          sub="Last 100 blocks"
          trend="flat"
        />
        <StatCard
          label="Active Validators"
          value={chain?.activeValidators || 0}
          sub={`${overallUptime.toFixed(2)}% avg uptime`}
          trend="up"
        />
        <StatCard
          label="Total Transactions"
          value={(chain?.totalTransactions || 0).toLocaleString()}
          sub="All time"
          trend="up"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ChartCard title="Transactions Per Second (24h)" height={180}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={tpsHistory} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tpsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: "#4B5563", fontSize: 10 }} tickLine={false} axisLine={false} interval={5} />
              <YAxis tick={{ fill: "#4B5563", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip {...chartTooltipStyle} formatter={(v) => [`${v} TPS`, "TPS"]} />
              <Area type="monotone" dataKey="tps" stroke="#3B82F6" strokeWidth={1.5} fill="url(#tpsGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Block Time (24h)" height={180}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={blockTimeHistory} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: "#4B5563", fontSize: 10 }} tickLine={false} axisLine={false} interval={5} />
              <YAxis tick={{ fill: "#4B5563", fontSize: 10 }} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
              <Tooltip {...chartTooltipStyle} formatter={(v) => [`${v}s`, "Block Time"]} />
              <Line type="monotone" dataKey="blockTime" stroke="#22D3EE" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ChartCard title="Daily Transaction Volume (14d)" height={180}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={txVolumeHistory} margin={{ top: 0, right: 4, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "#4B5563", fontSize: 10 }} tickLine={false} axisLine={false} interval={1} />
              <YAxis tick={{ fill: "#4B5563", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip {...chartTooltipStyle} formatter={(v) => [v.toLocaleString(), "Transactions"]} />
              <Bar dataKey="transactions" fill="#3B82F6" radius={[3, 3, 0, 0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Gas Utilization % (24h)" height={180}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={gasUsageHistory} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gasGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A855F7" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: "#4B5563", fontSize: 10 }} tickLine={false} axisLine={false} interval={5} />
              <YAxis tick={{ fill: "#4B5563", fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip {...chartTooltipStyle} formatter={(v) => [`${v}%`, "Gas Used"]} />
              <Area type="monotone" dataKey="gasUsed" stroke="#A855F7" strokeWidth={1.5} fill="url(#gasGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Validator Table */}
      <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800">
          <span className="text-sm font-semibold text-white">Validator Nodes</span>
          <span className="ml-2 text-xs text-gray-500">({validatorNodes.length} active)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-800/60">
                <th className="text-left px-5 py-2.5 text-gray-500 font-medium">Node ID</th>
                <th className="text-left px-4 py-2.5 text-gray-500 font-medium">Address</th>
                <th className="text-left px-4 py-2.5 text-gray-500 font-medium">Uptime</th>
                <th className="text-left px-4 py-2.5 text-gray-500 font-medium">Stake</th>
                <th className="text-left px-4 py-2.5 text-gray-500 font-medium">Location</th>
                <th className="text-left px-5 py-2.5 text-gray-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {validatorNodes.map((node, i) => (
                <tr key={node.id} className={`border-b border-gray-800/40 hover:bg-white/[0.02] transition-colors ${i === validatorNodes.length - 1 ? "border-0" : ""}`}>
                  <td className="px-5 py-2.5 text-blue-400 font-mono">{node.id}</td>
                  <td className="px-4 py-2.5 text-blue-400 font-mono">{node.address}</td>
                  <td className="px-4 py-2.5 text-gray-300">{node.uptime}</td>
                  <td className="px-4 py-2.5 text-gray-300">{node.stake}</td>
                  <td className="px-4 py-2.5 text-gray-400">{node.location}</td>
                  <td className="px-5 py-2.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      node.status === "Active"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${node.status === "Active" ? "bg-green-400" : "bg-yellow-400"}`} />
                      {node.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Stats;
