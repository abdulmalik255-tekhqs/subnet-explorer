import { useState } from "react";

const RANGE_OPTIONS = ["1D", "7D", "30D"];

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

// UI-only placeholders — wired up once the subnet/detail APIs are integrated.
export default function L1DetailTab({ chain, chainType, chainId }) {
  const [range, setRange] = useState("7D");

  const stats = [
    { label: "TPS", value: chain?.tps ?? "0", delta: "12%", accent: "#3b82f6" },
    {
      label: "Daily Active Addrs",
      value: fmtNum(chain?.address_count),
      accent: "#22c55e",
    },
    {
      label: "Total Transactions",
      value: fmtNum(chain?.transaction_count),
      accent: "#3b82f6",
    },
    {
      label: "Total Contracts",
      value: fmtNum(chain?.total_deployed_contracts),
      accent: "#f59e0b",
    },
  ];

  const subnetBlockchains = [
    {
      name: chain?.name,
      chainId: chainId,
      vmId: "srExXiWaHuhNyGwPUi444…",
    },
    {
      name: `${chain?.name} Testnet`,
      chainId: chainId ? String(Number(chainId) + 1) : "—",
      vmId: "qLXMev7yAYf7XT3JR3…",
    },
  ];

  return (
    <div className="px-5 py-5 grid grid-cols-1 xl:grid-cols-2 gap-4">
      {/* Left column */}
      <div className="space-y-4">
        <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
          <InfoRow label="Subnet ID" value={truncateId(chain?.orbit_id)} />
          <InfoRow
            label="Control keys"
            value="P-ryt1fu2mz9k… P-ryt2bc8nw4…"
          />
          <InfoRow label="VM type" value="Subnet-EVM" />
          <InfoRow label="Chain ID" value={chainId ?? "—"} />
          <InfoRow label="Created" value="—" />
          <InfoRow
            label="Description"
            value={`${chainType ?? "orbit"} L1 registered on the network.`}
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
              Transaction Count Graph
            </span>
            <div className="flex items-center gap-1 bg-[#111827] border border-gray-800 rounded-lg p-0.5">
              {RANGE_OPTIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                    range === r
                      ? "bg-[#1E293B] text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <svg
            viewBox="0 0 1000 140"
            preserveAspectRatio="none"
            className="w-full h-[140px]"
          >
            <defs>
              <linearGradient id="detailTxGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 65 Q 100 55 200 60 T 400 58 T 600 52 T 800 50 T 1000 48 L 1000 140 L 0 140 Z"
              fill="url(#detailTxGrad)"
              stroke="none"
            />
            <path
              d="M0 65 Q 100 55 200 60 T 400 58 T 600 52 T 800 50 T 1000 48"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
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
        </div>

        <div className="bg-[#0B111D] border border-gray-800 rounded-xl p-4">
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
        </div>
      </div>
    </div>
  );
}
