import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "@phosphor-icons/react";
import L1StatsTab from "./L1StatsTab";
import L1DetailTab from "./L1DetailTab";

const TABS = ["Explorer", "Stats", "Detail"];

const STAT_ACCENTS = ["#3b82f6", "#2dd4a7", "#f59e0b", "#22c55e"];

const fmtNum = (val) => {
  if (!val || val === "0") return "–";
  const n = parseInt(val, 10);
  if (isNaN(n)) return val;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString();
};

// Placeholder rows — wired up once the blocks/transactions APIs are integrated.
const LATEST_BLOCKS = [
  { block: "847,291", validator: "0x1a2b3c…", txns: 24, age: "2s" },
  { block: "847,290", validator: "0x3c4d5e…", txns: 18, age: "5s" },
  { block: "847,289", validator: "0x5e6f7a…", txns: 31, age: "9s" },
];

const LATEST_TRANSACTIONS = [
  { hash: "0x4a8b2c…", value: "1.24", status: "success", age: "2s" },
  { hash: "0x9f2c5e…", value: "0.05", status: "success", age: "7s" },
  { hash: "0x2e9d8f…", value: "84.0", status: "failed", age: "12s" },
];

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
        <div className="text-[11px] text-green-400 mt-1 flex items-center gap-1">
          <span>↑</span> {delta}
        </div>
      )}
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const ok = status === "success";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
        ok ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
      }`}
    >
      {ok ? "✓ Success" : "✗ Failed"}
    </span>
  );
};

export default function L1DetailPanel({ chain, onClose }) {
  const dispatch = useDispatch();
  const { dashboard, dashboardLoading } = useSelector((s) => s.orbit);
  const [activeTab, setActiveTab] = useState("Explorer");
  const symbol = chain?.symbol || "RYT";
  const chainType = "orbit";
  const chainId = chain?.orbit_id;
  console.log(dashboard, "in the 1st step");
  useEffect(() => {
    if (chainId) {
      dispatch.orbit.handleGetOrbitDashboard({ type: chainType, chainId });
    }
  }, [dispatch, chainType, chainId]);

  const stats = [
    {
      label: "Total Txn Count",
      value: fmtNum(dashboard?.total_transactions ?? chain?.transaction_count),
    },
    {
      label: "Transactions Per Second",
      value: dashboard?.current_tps ?? chain?.tps ?? "0",
    },
    {
      label: "Daily Active Addresses",
      value: fmtNum(dashboard?.total_accounts ?? chain?.address_count),
    },
    {
      label: "Total Contracts Deployed",
      value: fmtNum(
        dashboard?.total_contracts ?? chain?.total_deployed_contracts,
      ),
    },
  ];

  return (
    <div className="bg-[#111827] border border-gray-800/60 rounded-2xl shadow-2xl shadow-black/50 w-full mb-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800/60">
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
          Orbit Detail — {chain?.name}
        </span>
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 bg-[#0B111D] text-gray-300 text-xs font-semibold hover:border-gray-600 hover:text-white transition-colors"
        >
          <X size={12} />
          Close
        </button>
      </div>

      {/* Tabs */}
      <div className="px-5 border-b border-gray-800/60">
        <div className="flex items-center gap-0">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "text-white border-blue-500"
                  : "text-gray-500 border-transparent hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "Stats" ? (
        <L1StatsTab chain={chain} chainType={chainType} chainId={chainId} />
      ) : activeTab === "Detail" ? (
        <L1DetailTab chain={chain} chainType={chainType} chainId={chainId} />
      ) : (
        <div className="px-5 py-5 space-y-4">
          {/* Stat cards */}
          {dashboardLoading && (
            <div className="text-[10px] text-gray-500 tracking-wider uppercase -mb-2">
              Refreshing…
            </div>
          )}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <StatCard
                key={s.label}
                label={s.label}
                value={s.value}
                accent={STAT_ACCENTS[i % STAT_ACCENTS.length]}
              />
            ))}
          </div>

          {/* Latest Blocks / Transactions */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Latest Blocks */}
            <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
                <span className="text-sm font-semibold text-white">
                  Latest Blocks
                </span>
                <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  View all →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-800/60">
                      <th className="text-left px-5 py-2.5 text-gray-500 font-medium">
                        Block
                      </th>
                      <th className="text-left px-3 py-2.5 text-gray-500 font-medium">
                        Validator
                      </th>
                      <th className="text-left px-3 py-2.5 text-gray-500 font-medium">
                        Txns
                      </th>
                      <th className="text-right px-5 py-2.5 text-gray-500 font-medium">
                        Age
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {LATEST_BLOCKS.map((row, i) => (
                      <tr
                        key={row.block}
                        className={`border-b border-gray-800/40 hover:bg-white/[0.02] transition-colors ${
                          i === LATEST_BLOCKS.length - 1 ? "border-0" : ""
                        }`}
                      >
                        <td className="px-5 py-2.5">
                          <span className="text-blue-400 font-medium">
                            #{row.block}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 font-mono text-gray-300">
                          {row.validator}
                        </td>
                        <td className="px-3 py-2.5 font-semibold text-gray-200">
                          {row.txns}
                        </td>
                        <td className="px-5 py-2.5 text-right text-gray-500">
                          {row.age}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Latest Transactions */}
            <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
                <span className="text-sm font-semibold text-white">
                  Latest Transactions
                </span>
                <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  View all →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-800/60">
                      <th className="text-left px-5 py-2.5 text-gray-500 font-medium">
                        Tx Hash
                      </th>
                      <th className="text-left px-3 py-2.5 text-gray-500 font-medium">
                        Value
                      </th>
                      <th className="text-left px-3 py-2.5 text-gray-500 font-medium">
                        Status
                      </th>
                      <th className="text-right px-5 py-2.5 text-gray-500 font-medium">
                        Age
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {LATEST_TRANSACTIONS.map((row, i) => (
                      <tr
                        key={row.hash}
                        className={`border-b border-gray-800/40 hover:bg-white/[0.02] transition-colors ${
                          i === LATEST_TRANSACTIONS.length - 1 ? "border-0" : ""
                        }`}
                      >
                        <td className="px-5 py-2.5">
                          <span className="text-blue-400 font-mono">
                            {row.hash}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 font-mono text-gray-300">
                          {row.value} {symbol}
                        </td>
                        <td className="px-3 py-2.5">
                          <StatusBadge status={row.status} />
                        </td>
                        <td className="px-5 py-2.5 text-right text-gray-500">
                          {row.age}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
