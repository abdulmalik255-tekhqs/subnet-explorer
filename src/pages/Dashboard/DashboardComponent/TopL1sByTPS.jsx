const data = [
  {
    name: "RYT Chain",
    color: "bg-blue-500",
    tps: "840",
    txns: "424K",
    trendColor: "bg-blue-500",
    trend: [5, 8, 6, 9, 7, 10, 15],
  },
  {
    name: "DeFi L1",
    color: "bg-cyan-400",
    tps: "320",
    txns: "192K",
    trendColor: "bg-cyan-400",
    trend: [6, 5, 4, 7, 3, 5, 9],
  },
  {
    name: "Game L1",
    color: "bg-amber-400",
    tps: "180",
    txns: "84K",
    trendColor: "bg-amber-400",
    trend: [6, 7, 5, 6, 5, 6, 8],
  },
];

export default function TopL1sByTPS() {
  return (
    <div className="bg-[#111827] border border-gray-800/60 rounded-2xl p-3 shadow-2xl shadow-black/50 w-[50%]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#7D8FB3]">
          TOP L1S BY TPS
        </h3>

        <button className="text-sm text-[#4D8DFF] hover:text-[#6AA4FF]">
          View all →
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#16284A]">
        {/* Header Row */}
        <div className="grid grid-cols-4 bg-[#0E1B31] px-4 py-3 text-xs uppercase tracking-wider text-[#6F82A7]">
          <div>L1 Name</div>
          <div>TPS</div>
          <div>Daily Txns</div>
          <div>7D Trend</div>
        </div>

        {/* Data Rows */}
        {data.map((item, index) => (
          <div
            key={item.name}
            className={`grid grid-cols-4 items-center px-4 py-4 ${
              index !== data.length - 1 ? "border-b border-[#16284A]" : ""
            }`}
          >
            {/* Name */}
            <div className="flex items-center gap-3">
              <div
                className={`h-3 w-3 rounded-sm ${item.color} shadow-[0_0_8px_currentColor]`}
              />
              <span className="font-medium text-white">{item.name}</span>
            </div>

            {/* TPS */}
            <div
              className={`font-mono ${
                item.color === "bg-blue-500"
                  ? "text-blue-400"
                  : item.color === "bg-cyan-400"
                    ? "text-cyan-400"
                    : "text-amber-400"
              }`}
            >
              {item.tps}
            </div>

            {/* Transactions */}
            <div className="text-white">{item.txns}</div>

            {/* Trend */}
            <div className="flex h-8 items-end gap-1">
              {item.trend.map((height, idx) => (
                <div
                  key={idx}
                  className={`w-1 rounded-sm ${item.trendColor}`}
                  style={{
                    height: `${height * 2}px`,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
