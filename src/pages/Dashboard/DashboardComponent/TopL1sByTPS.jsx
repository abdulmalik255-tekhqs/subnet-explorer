import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const ROW_STYLES = [
  {
    dotColor: "bg-blue-500",
    tpsColor: "text-blue-400",
    trendColor: "bg-blue-500",
    trend: [5, 8, 6, 9, 7, 10, 15],
  },
  {
    dotColor: "bg-cyan-400",
    tpsColor: "text-cyan-400",
    trendColor: "bg-cyan-400",
    trend: [6, 5, 4, 7, 3, 5, 9],
  },
  {
    dotColor: "bg-amber-400",
    tpsColor: "text-amber-400",
    trendColor: "bg-amber-400",
    trend: [6, 7, 5, 6, 5, 6, 8],
  },
];

const fmtNum = (val) => {
  if (!val || val === "0") return "–";
  const n = parseInt(val, 10);
  if (isNaN(n)) return val;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString();
};

export default function TopL1sByTPS() {
  const dispatch = useDispatch();
  const { registeredOrbits, registeredOrbitsLoading } = useSelector(
    (s) => s.orbit,
  );

  useEffect(() => {
    dispatch.orbit.handleGetOrbits({ limit: "3" });
  }, [dispatch]);

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
        {registeredOrbitsLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`grid grid-cols-4 items-center px-4 py-4 ${
                i !== 2 ? "border-b border-[#16284A]" : ""
              }`}
            >
              {Array.from({ length: 4 }).map((__, c) => (
                <div
                  key={c}
                  className="h-3.5 bg-gray-800 animate-pulse rounded w-3/4"
                />
              ))}
            </div>
          ))
        ) : registeredOrbits.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs text-gray-600">
            No L1s found
          </div>
        ) : (
          registeredOrbits.map((item, index) => {
            const style = ROW_STYLES[index % ROW_STYLES.length];
            return (
              <div
                key={item.orbit_id ?? index}
                className={`grid grid-cols-4 items-center px-4 py-4 ${
                  index !== registeredOrbits.length - 1
                    ? "border-b border-[#16284A]"
                    : ""
                }`}
              >
                {/* Name */}
                <div className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-sm ${style.dotColor} shadow-[0_0_8px_currentColor]`}
                  />
                  <span className="font-medium text-white">{item.name}</span>
                </div>

                {/* TPS */}
                <div className={`font-mono ${style.tpsColor}`}>
                  {fmtNum(item.tps)}
                </div>

                {/* Transactions */}
                <div className="text-white">
                  {fmtNum(item.transaction_count)}
                </div>

                {/* Trend */}
                <div className="flex h-8 items-end gap-1">
                  {style.trend.map((height, idx) => (
                    <div
                      key={idx}
                      className={`w-1 origin-bottom rounded-sm animate-growBar ${style.trendColor}`}
                      style={{
                        height: `${height * 2}px`,
                        animationDelay: `${idx * 80}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}