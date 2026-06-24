import React from "react";

const StatCard = ({ title, value, subtext, borderTopColor }) => {
  return (
    <div
      className={`bg-[#111827] border border-gray-800 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden`}
    >
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${borderTopColor}`}
      ></div>
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold text-gray-500 tracking-wider uppercase">
          {title}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">{value}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        {subtext.startsWith("+") || subtext.includes("↑") ? (
          <span className="text-emerald-400 text-xs font-semibold">
            ↑ {subtext}
          </span>
        ) : (
          <span className="text-gray-400 text-xs font-medium">{subtext}</span>
        )}
      </div>
    </div>
  );
};

const NetworkOverview = () => {
  const stats = [
    {
      title: "Total L1s",
      value: "24",
      subtext: "2 this week",
      borderTopColor: "bg-blue-500",
    },
    {
      title: "Total Blockchains",
      value: "67",
      subtext: "5 this month",
      borderTopColor: "bg-indigo-500",
    },
    {
      title: "Network TPS",
      value: "2,210",
      subtext: "12% vs 24h avg",
      borderTopColor: "bg-teal-400",
    },
    {
      title: "Daily Active Addrs",
      value: "24,840",
      subtext: "3.2%",
      borderTopColor: "bg-yellow-500",
    },
    {
      title: "Total Transaction Count",
      value: "1.84M",
      subtext: "424K today",
      borderTopColor: "bg-blue-600",
    },
    {
      title: "Total Contracts Deployed",
      value: "42,810",
      subtext: "0.8%",
      borderTopColor: "bg-purple-500",
    },
  ];

  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">Network overview</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#111827] border border-gray-800 rounded-lg px-3 py-1">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[11px] font-bold text-emerald-500 uppercase">
              Live
            </span>
          </div>
          <span className="text-xs text-gray-500">Updated 6s ago</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {/* First row spans */}
        {stats.slice(0, 4).map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.slice(4).map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default NetworkOverview;
