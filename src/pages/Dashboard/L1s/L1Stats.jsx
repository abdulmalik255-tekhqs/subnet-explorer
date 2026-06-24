import React from "react";

const StatCard = ({ title, value, subtext, borderTopColor }) => {
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
          <span className="text-2xl font-bold text-white">{value}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-1">
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

const L1Stats = () => {
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
      title: "Combined TPS",
      value: "2,210",
      subtext: "12% vs 24h avg",
      borderTopColor: "bg-teal-400",
    },
    {
      title: "Daily Transactions",
      value: "24,840",
      subtext: "3.2%",
      borderTopColor: "bg-yellow-500",
    },
  ];

  return (
    <div className="flex flex-col gap-6 mt-1 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {/* First row spans */}
        {stats.slice(0, 4).map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default L1Stats;
