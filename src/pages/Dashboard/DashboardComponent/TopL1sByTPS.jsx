import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const TABLE_GRID_CLASS =
  "grid grid-cols-[minmax(0,1.6fr)_minmax(96px,0.9fr)_minmax(88px,0.8fr)_88px] gap-x-4";

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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { registeredOrbits, registeredOrbitsLoading } = useSelector(
    (s) => s.orbit,
  );

  useEffect(() => {
    dispatch.orbit.handleGetOrbits({ limit: "3" });
  }, [dispatch]);

  return (
    <div className="w-full lg:w-1/2 bg-[#111827] border border-gray-800/60 rounded-2xl p-3 shadow-2xl shadow-black/50">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#7D8FB3]">
          Top Orbits by TPS
        </h3>

        <button
          className="text-sm text-[#4D8DFF] hover:text-[#6AA4FF] cursor-pointer transition-colors duration-200"
          onClick={() => {
            navigate("/orbit");
          }}
        >
          View all →
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#16284A]">
        {/* Header Row */}
        <div
          className={`${TABLE_GRID_CLASS} bg-[#0E1B31] px-4 py-3 text-xs uppercase tracking-wider text-[#6F82A7]`}
        >
          <div className="min-w-0">Orbit Name</div>
          <div className="text-left">Chain ID</div>
          <div className="text-left">Daily Txns</div>
          <div className="text-left">7D Trend</div>
        </div>

        {/* Data Rows */}
        {registeredOrbitsLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`${TABLE_GRID_CLASS} items-center px-4 py-4 ${
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
            No Orbits found
          </div>
        ) : (
          registeredOrbits.map((item, index) => {
            const style = ROW_STYLES[index % ROW_STYLES.length];
            return (
              <div
                key={item.orbit_id ?? index}
                className={`${TABLE_GRID_CLASS} items-center px-4 py-4 ${
                  index !== registeredOrbits.length - 1
                    ? "border-b border-[#16284A]"
                    : ""
                }`}
              >
                {/* Name */}
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`h-3 w-3 shrink-0 rounded-sm ${style.dotColor} shadow-[0_0_8px_currentColor]`}
                  />
                  <span
                    className="truncate font-medium text-white"
                    title={item.name}
                  >
                    {item.name}
                  </span>
                </div>

                {/* Chain ID */}
                <div
                  className={`font-mono text-lg leading-none ${style.tpsColor}`}
                >
                  {item.chain_id}
                </div>

                {/* Transactions */}
                <div className="text-lg leading-none text-white">
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
