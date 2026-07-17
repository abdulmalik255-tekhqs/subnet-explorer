import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
const REFRESH_INTERVAL_MS = 5000;

const WavePaths = () => (
  <>
    <path
      d="M0 20 Q 25 5, 50 20 T 100 20 T 150 20 T 200 20 T 250 20 T 300 20 T 350 20 T 400 20 T 450 20 T 500 20 T 550 20 T 600 20 T 650 20 T 700 20 T 750 20 T 800 20 T 850 20 T 900 20 T 950 20 T 1000 20"
      fill="none"
      stroke="#22D3EE"
      strokeWidth="1.5"
    />
    <path
      d="M0 25 Q 25 10, 50 25 T 100 25 T 150 25 T 200 25 T 250 25 T 300 25 T 350 25 T 400 25 T 450 25 T 500 25 T 550 25 T 600 25 T 650 25 T 700 25 T 750 25 T 800 25 T 850 25 T 900 25 T 950 25 T 1000 25"
      fill="none"
      stroke="#2563EB"
      strokeWidth="0.8"
    />
  </>
);

const ChainPulse = () => {
  const dispatch = useDispatch();
  const { metricsHistory } = useSelector((s) => s.orbit);

  useEffect(() => {
    const fetchTps = () => {
      const end = Date.now();
      const start = end - TWENTY_FOUR_HOURS_MS;
      dispatch.orbit.handleGetMetricsHistory({
        metrics: ["tps"],
        start: String(start),
        end: String(end),
        type: "primary",
      });
    };
    fetchTps();
    const intervalId = setInterval(fetchTps, REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [dispatch]);

  const { hasTps, latestTps } = useMemo(() => {
    const tpsPoints = (metricsHistory ?? [])
      ?.filter((m) => m?.metric === "tps")
      ?.sort((a, b) => Number(a?.timestamp) - Number(b?.timestamp));
    const last = tpsPoints[tpsPoints?.length - 1];
    return {
      hasTps: tpsPoints?.length > 0,
      latestTps: last ? parseFloat(last?.value) || 0 : 0,
    };
  }, [metricsHistory]);

  /* wave amplitude/speed live-driven by the latest TPS reading */
  const ampScale = Math.min(1.6, Math.max(0.5, latestTps / 1000 || 0.5));
  const waveDuration = Math.min(6, Math.max(1.5, 4 - latestTps / 1000));

  return (
    <div className="w-full bg-[#0B111D] px-6 py-2 flex items-center border-b border-gray-800">
      <div className="flex flex-col min-w-[120px]">
        <span className="text-[10px] font-bold text-gray-500 tracking-wider">
          CHAIN PULSE — TPS
        </span>
      </div>

      <div className="flex-1 h-12 relative overflow-hidden flex items-center">
        {hasTps ? (
          /* Synthetic wave representation, seamlessly scrolling — amplitude/speed reflect latest TPS */
          <div
            className="absolute inset-y-0 left-0 flex animate-waveScroll"
            style={{ width: "200%", animationDuration: `${waveDuration}s` }}
          >
            <svg
              viewBox="0 0 1000 40"
              preserveAspectRatio="none"
              className="w-1/2 h-full opacity-60"
              style={{
                transform: `scaleY(${ampScale})`,
                transformOrigin: "center",
              }}
            >
              <WavePaths />
            </svg>
            <svg
              viewBox="0 0 1000 40"
              preserveAspectRatio="none"
              className="w-1/2 h-full opacity-60"
              style={{
                transform: `scaleY(${ampScale})`,
                transformOrigin: "center",
              }}
            >
              <WavePaths />
            </svg>
          </div>
        ) : (
          /* No TPS data — flat, static line */
          <svg
            viewBox="0 0 1000 40"
            preserveAspectRatio="none"
            className="w-full h-full opacity-40"
          >
            <line
              x1="0"
              y1="20"
              x2="1000"
              y2="20"
              stroke="#4B5563"
              strokeWidth="1.5"
            />
          </svg>
        )}
      </div>

      <div className="flex items-center gap-1 text-[#22D3EE] font-bold text-lg">
        <span>{latestTps ? latestTps?.toLocaleString() : "0"}</span>
        <span className="text-sm font-normal text-gray-500">/s</span>
      </div>
    </div>
  );
};

export default ChainPulse;
