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

const StatCard = ({ title, value, subtext, borderTopColor, loading }) => {
  return (
    <div
      className={`bg-[#111827] border border-gray-800 rounded-xl p-2 flex flex-col justify-between relative overflow-hidden`}
    >
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${borderTopColor}`}
      ></div>
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-bold text-gray-500 tracking-wider uppercase">
          {title}
        </span>
        <div className="flex items-baseline gap-1">
          {loading ? (
            <span className="inline-block w-20 h-7 bg-gray-800 animate-pulse rounded" />
          ) : (
            <span className="text-2xl font-bold text-white">{value}</span>
          )}
        </div>
      </div>
      {/* <div className="flex items-center gap-1.5 mt-1">
        {subtext.startsWith("+") || subtext.includes("↑") ? (
          <span className="text-emerald-400 text-xs font-semibold">
            ↑ {subtext}
          </span>
        ) : (
          <span className="text-gray-400 text-xs font-medium">{subtext}</span>
        )}
      </div> */}
    </div>
  );
};

const L1Stats = () => {
  const dispatch = useDispatch();
  const { networkOverview: ov, networkOverviewLoading: loading } = useSelector(
    (s) => s.orbit,
  );

  useEffect(() => {
    dispatch.orbit.handleGetNetworkOverview();
  }, [dispatch]);
  const stats = [
    {
      title: "Total L1s",
      value: fmt(ov?.total_orbits),
      subtext: "",
      borderTopColor: "bg-blue-500",
    },
    {
      title: "Total Blockchains",
      value: fmt(ov?.total_blockchains),
      subtext: "5 this month",
      borderTopColor: "bg-indigo-500",
    },
    {
      title: "Combined TPS",
      value: fmt(ov?.combined_tps),
      subtext: "12% vs 24h avg",
      borderTopColor: "bg-teal-400",
    },
    {
      title: "Daily Transactions",
      value: fmt(ov?.total_transactions),
      subtext: "3.2%",
      borderTopColor: "bg-yellow-500",
    },
  ];

  return (
    <div className="flex flex-col gap-6 mt-1 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {/* First row spans */}
        {stats.slice(0, 4).map((stat, index) => (
          <StatCard key={index} {...stat} loading={loading} />
        ))}
      </div>
    </div>
  );
};

export default L1Stats;
