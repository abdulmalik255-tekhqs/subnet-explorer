import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const fmt = (val) => {
  if (val === undefined || val === null || val === "") return "—";
  const n = parseFloat(val);
  if (isNaN(n)) return val;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return n.toLocaleString();
  return String(val);
};

const InfoItem = ({ label, value, loading }) => (
  <div className="flex flex-col gap-1 px-4 py-3 bg-[#0D1421] rounded-xl border border-gray-800/40 hover:border-gray-700/60 transition-colors">
    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
      {label}
    </span>
    <span className="text-[15px] font-bold text-gray-100 tracking-tight">
      {loading ? (
        <span className="inline-block w-16 h-4 bg-gray-800 animate-pulse rounded" />
      ) : (
        value
      )}
    </span>
  </div>
);

const PrimaryNetworkPinned = ({
  type = "orbit",
  chainId = "1001",
  selectedChain,
  onToggleChain,
}) => {
  const dispatch = useDispatch();
  const { dashboard, dashboardLoading } = useSelector((s) => s.orbit);

  useEffect(() => {
    dispatch.orbit.handleGetOrbitDashboard({ type, chainId });
  }, [dispatch, type, chainId]);

  const d = dashboard;
  const isSelected =
    selectedChain?.type === "primary" &&
    selectedChain?.chain?.chain_id === d?.chain_id;

  return (
    <>
      <div className="w-full mt-1">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-2 opacity-60">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">
            Primary Network (Pinned)
          </h2>
          <div className="h-[1px] w-full bg-gradient-to-r from-gray-800 to-transparent" />
        </div>

        {/* Main Card */}
        <div
          className={`bg-[#111827] border rounded-2xl p-3 shadow-2xl shadow-black/50 transition-colors ${
            isSelected
              ? "border-blue-500/60 bg-blue-500/[0.04]"
              : "border-gray-800/60"
          }`}
        >
          <div className="flex flex-col gap-8">
            {/* Header Info */}
            <div
              className="flex items-center gap-5 min-w-[320px] cursor-pointer"
              onClick={() => onToggleChain?.(d, "primary")}
            >
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-red-500/20">
                  MC
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#111827] rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    Main Chain
                  </h3>
                  <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                      Active
                    </span>
                  </div>
                </div>
                {/* <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest opacity-70">
                  Orbit-EVM compatible
                </p> */}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <InfoItem
                label="Latest Block"
                value={fmt(d?.latest_block_height)}
                loading={dashboardLoading}
              />
              {/* <InfoItem
                label="TPS"
                value={fmt(d?.current_tps)}
                loading={dashboardLoading}
              /> */}
              <InfoItem
                label="Total Accounts"
                value={fmt(d?.total_accounts)}
                loading={dashboardLoading}
              />
              <InfoItem
                label="Total Txns"
                value={fmt(d?.total_transactions)}
                loading={dashboardLoading}
              />
              <InfoItem
                label="Contracts"
                value={fmt(d?.total_contracts)}
                loading={dashboardLoading}
              />
              <InfoItem
                label="NFT Transfers"
                value={fmt(d?.total_nft_transfers)}
                loading={dashboardLoading}
              />
              <InfoItem
                label="ERC-20 Transfers"
                value={fmt(d?.total_erc20_transfers)}
                loading={dashboardLoading}
              />
              <InfoItem
                label="Chain ID"
                value={d?.chain_id ?? "—"}
                loading={dashboardLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrimaryNetworkPinned;
