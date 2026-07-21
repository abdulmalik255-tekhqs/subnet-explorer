import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const fmt = (val) => {
  if (val === undefined || val === null || val === "") return "—";
  const n = parseFloat(val);
  if (isNaN(n)) return String(val);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return n.toLocaleString();
  return String(val);
};

const StatCard = ({ title, value, subtext, borderTopColor, loading }) => (
  <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden">
    <div className={`absolute top-0 left-0 right-0 h-1 ${borderTopColor}`} />
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-bold text-gray-500 tracking-wider uppercase">
        {title}
      </span>
      <div className="flex items-baseline gap-2">
        {loading ? (
          <span className="inline-block w-20 h-7 bg-gray-800 animate-pulse rounded" />
        ) : (
          <span className="text-2xl font-bold text-white">{value}</span>
        )}
      </div>
    </div>
    {/* <div className="flex items-center gap-1.5 mt-2">
      {subtext.startsWith("+") || subtext.includes("↑") ? (
        <span className="text-emerald-400 text-xs font-semibold">↑ {subtext}</span>
      ) : (
        <span className="text-gray-400 text-xs font-medium">{subtext}</span>
      )}
    </div> */}
  </div>
);

const NetworkOverview = () => {
  const dispatch = useDispatch();
  const {
    networkOverview: ov,
    networkOverviewLoading: loading,
    dashboard,
  } = useSelector((s) => s.orbit);

  useEffect(() => {
    dispatch.orbit.handleGetNetworkOverview();
    dispatch.orbit.handleGetOrbitDashboard({ type: "primary" });
  }, [dispatch]);

  const stats = [
    {
      title: "Total Orbits",
      value: fmt(ov?.total_orbits),
      subtext: "↑ 2 this week",
      borderTopColor: "bg-blue-500",
    },
    {
      title: "Total Blockchains",
      value: fmt(ov?.total_blockchains),
      subtext: "↑ 5 this month",
      borderTopColor: "bg-indigo-500",
    },
    {
      title: "Network TPS",
      value: fmt(ov?.combined_tps),
      subtext: "Combined across all chains",
      borderTopColor: "bg-teal-400",
    },
    {
      title: "Total Addresses",
      value: fmt(dashboard?.total_accounts),
      subtext: "3.2%",
      borderTopColor: "bg-yellow-500",
    },
    {
      title: "Total Transaction Count",
      value: fmt(ov?.total_transactions),
      subtext: "All time",
      borderTopColor: "bg-blue-600",
    },
    {
      title: "Total Contracts Deployed",
      value: fmt(dashboard?.total_contracts),
      subtext: "0.8%",
      borderTopColor: "bg-purple-500",
    },
  ];

  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">Network Overview</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#111827] border border-gray-800 rounded-lg px-3 py-1">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[11px] font-bold text-emerald-500 uppercase">
              Live
            </span>
          </div>
          {/* <span className="text-xs text-gray-500">Updated 6s ago</span> */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {stats.slice(0, 4).map((stat, i) => (
          <StatCard key={i} {...stat} loading={loading} />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.slice(4).map((stat, i) => (
          <StatCard key={i} {...stat} loading={loading} />
        ))}
      </div>
    </div>
  );
};

export default NetworkOverview;
