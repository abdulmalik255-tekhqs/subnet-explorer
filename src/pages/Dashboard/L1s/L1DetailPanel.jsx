import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { X } from "@phosphor-icons/react";
// import L1StatsTab from "./L1StatsTab";
import L1DetailTab from "./L1DetailTab";
import LatestBlocks from "./Blocks/LatestBlocks";
import LatestTransactions from "./Transactions/LatestTransactions";

const TABS = ["Explorer", "Detail"];

const STAT_ACCENTS = ["#3b82f6", "#2dd4a7", "#f59e0b", "#22c55e"];

const fmtNum = (val) => {
  if (!val || val === "0") return "–";
  const n = parseInt(val, 10);
  if (isNaN(n)) return val;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString();
};

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

export default function L1DetailPanel({ chain, onClose, type }) {
  const dispatch = useDispatch();
  const params = useParams();
  const { orbitDashboard, dashboardLoading, orbitDetail } = useSelector(
    (s) => s.orbit,
  );
  const [activeTab, setActiveTab] = useState("Explorer");
  const symbol = chain?.symbol || "RYT";
  const chainType = type;
  const chainId = chain?.chain_id;
  useEffect(() => {
    if (chainId || params?.chainID) {
      dispatch.orbit.handleOrbitDashboard({
        type: chainType,
        chainId: chainId || params?.chainID,
      });
    }
  }, [dispatch, chainType, chainId]);
  useEffect(() => {
    if (chainId || params?.chainID) {
      dispatch.orbit.handleGetOrbitDetail({
        chainId: chainId || params?.chainID,
      });
    }
  }, [dispatch, chainId, params?.chainID]);
  const stats = [
    {
      label: "Total Txn Count",
      value: fmtNum(
        orbitDashboard?.total_transactions ?? chain?.transaction_count,
      ),
    },
    {
      label: "Transactions Per Second",
      value: orbitDashboard?.current_tps ?? chain?.tps ?? "0",
    },
    {
      label: "Total Addresses",
      value: fmtNum(orbitDashboard?.total_accounts ?? chain?.address_count),
    },
    {
      label: "Total Contracts Deployed",
      value: fmtNum(
        orbitDashboard?.total_contracts ?? chain?.total_deployed_contracts,
      ),
    },
  ];

  return (
    <div className="bg-[#111827] border border-gray-800/60 rounded-2xl shadow-2xl shadow-black/50 w-full mb-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800/60">
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
          {type === "primary"
            ? "Primary Network"
            : `Orbit Detail — ${orbitDetail?.name}`}
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
      {
        // activeTab === "Stats" ? (
        //   <L1StatsTab chain={chain} chainType={chainType} chainId={chainId} />
        // ) :
        activeTab === "Detail" ? (
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
              <LatestBlocks chainId={chainId || params?.chainID} />
              <LatestTransactions
                chainId={chainId || params?.chainID}
                symbol={symbol}
              />
            </div>
          </div>
        )
      }
    </div>
  );
}
