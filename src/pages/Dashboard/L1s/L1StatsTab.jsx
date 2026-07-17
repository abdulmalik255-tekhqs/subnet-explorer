import { useState } from "react";
import { X } from "@phosphor-icons/react";

const RANGE_OPTIONS = ["1D", "7D", "30D"];

const CompareChip = ({ label, color, removable, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 bg-[#0B111D] text-xs font-semibold text-gray-200">
    <span
      className="w-1.5 h-1.5 rounded-full"
      style={{ backgroundColor: color }}
    />
    {label}
    {removable && (
      <button
        onClick={onRemove}
        className="ml-0.5 text-gray-500 hover:text-gray-300"
      >
        <X size={10} />
      </button>
    )}
  </span>
);

// UI-only placeholders — wired up once the compare/token-price APIs are integrated.
export default function L1StatsTab({ chain, chainType, chainId }) {
  const [range, setRange] = useState("7D");
  const [compareChains, setCompareChains] = useState([
    { name: "DeFi L1", color: "#2dd4a7" },
  ]);

  const primaryColor = "#3b82f6";

  return (
    <div
      className="px-5 py-5 space-y-4"
      data-chain-type={chainType}
      data-chain-id={chainId}
    >
      {/* Compare chips + range toggle */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <CompareChip label={chain?.name} color={primaryColor} />
          {compareChains.map((c) => (
            <CompareChip
              key={c.name}
              label={c.name}
              color={c.color}
              removable
              onRemove={() =>
                setCompareChains((prev) =>
                  prev.filter((x) => x.name !== c.name),
                )
              }
            />
          ))}
          <button className="px-3 py-1.5 rounded-lg border border-dashed border-gray-700 text-xs text-gray-400 hover:border-gray-600 hover:text-gray-200 transition-colors">
            + Add L1
          </button>
        </div>

        <div className="flex items-center gap-1 bg-[#0B111D] border border-gray-800 rounded-lg p-0.5">
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

      {/* Transaction count compare chart */}
      <div className="bg-[#0B111D] border border-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
            Transaction Count — Compare Metrics
          </span>
          <div className="flex items-center gap-3 text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-3 h-[2px] bg-blue-500 inline-block" />
              {chain?.name?.toUpperCase()}
            </span>
            {compareChains.map((c) => (
              <span key={c.name} className="flex items-center gap-1">
                <span
                  className="w-3 h-[2px] inline-block"
                  style={{ backgroundColor: c.color }}
                />
                {c.name?.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
        <svg
          viewBox="0 0 1000 140"
          preserveAspectRatio="none"
          className="w-full h-[140px]"
        >
          <path
            d="M0 70 Q 100 60 200 68 T 400 65 T 600 60 T 800 58 T 1000 55"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          <path
            d="M0 120 L 1000 118"
            fill="none"
            stroke="#2dd4a7"
            strokeWidth="1.5"
            strokeDasharray="6 5"
          />
        </svg>
      </div>

      {/* Token price external feed */}
      <div className="bg-[#0B111D] border border-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
            Token Price — External Feed
          </span>
          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold tracking-wide">
            COINGECKO
          </span>
        </div>
        <div className="flex items-end justify-between mb-2 flex-wrap gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">
              $4.02
            </span>
            <span className="text-xs text-green-400">↑ 3.4% (24h)</span>
          </div>
          <span className="text-xs text-gray-500">Vol $1.2M · Cap $402M</span>
        </div>
        <svg
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
          className="w-full h-[100px]"
        >
          <defs>
            <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 55 Q 100 40 200 45 T 400 35 T 600 42 T 800 50 T 1000 48 L 1000 100 L 0 100 Z"
            fill="url(#priceGrad)"
            stroke="none"
          />
          <path
            d="M0 55 Q 100 40 200 45 T 400 35 T 600 42 T 800 50 T 1000 48"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
}
