import React from "react";

const InfoItem = ({ label, value }) => (
  <div className="flex flex-col gap-1 px-4 py-3 bg-[#0D1421] rounded-xl border border-gray-800/40 hover:border-gray-700/60 transition-colors">
    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
      {label}
    </span>
    <span className="text-[15px] font-bold text-gray-100 tracking-tight">
      {value}
    </span>
  </div>
);

const PrimaryNetworkPinned = () => {
  return (
    <div className="w-full mt-2">
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-1 opacity-60">
        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">
          Primary Network (Pinned)
        </h2>
        <div className="h-[1px] w-full bg-gradient-to-r from-gray-800 to-transparent"></div>
      </div>

      {/* Main Card */}
      <div className="bg-[#111827] border border-gray-800/60 rounded-2xl p-3 shadow-2xl shadow-black/50">
        <div className="flex flex-col gap-8">
          {/* Header Info */}
          <div className="flex items-center gap-5 min-w-[320px]">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-red-500/20">
                MC
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#111827] rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Main Chain
                </h3>
                <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                    Active
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest opacity-70">
                EVM · Subnet-EVM compatible
              </p>
            </div>
          </div>

          {/* Stats Grid Container */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <InfoItem label="Latest block" value="847,291" />
            <InfoItem label="TPS" value="2,340" />
            <InfoItem label="Validators" value="1,200" />
            <InfoItem label="Daily txs" value="424K" />
            <InfoItem label="Active addrs" value="24,840" />
            <InfoItem label="Contracts" value="42,810" />
            <InfoItem label="Total txns" value="1.84M" />
            <InfoItem label="Chain ID" value="1000" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimaryNetworkPinned;
