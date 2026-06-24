import { useEffect } from "react";
import useTheme from "../../../hooks/useTheme";
import LiveNetworkGaugeChartAbove from "./LiveNetworkMetricsAbove";
import LiveNetworkGaugeChartBelow from "./LiveNetworkMetricsBelow";
import { useDispatch, useSelector } from "react-redux";

const LiveNetworkHealthMetrics = () => {
  const dispatch = useDispatch();
  const {
    metricsHealth,
    finalityTimeSeconds,
    blockTimeSeconds,
    successRateTime,
  } = useSelector((state) => state.dashboard);
  const { isDarkTheme } = useTheme();
  useEffect(() => {
    dispatch.dashboard.handleGetMetricsHealth();
    const now = Date.now();
    const startTime = (now - 90000).toString();
    const endTime = now.toString();

    dispatch.dashboard.handleGetBlockTimeSeconds({
      metric: ["block_time"],
      startTime,
      endTime,
    });
    const interval = setInterval(() => {
      dispatch.dashboard.handleGetMetricsHealth();
      dispatch.dashboard.handleGetBlockTimeSeconds({
        metric: ["block_time"],
        startTime,
        endTime,
      });
    }, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [finalityTimeSeconds, blockTimeSeconds, successRateTime]);
  return (
    <>
      <div className="w-full box-border">
        <div
          className={`${isDarkTheme ? "bg-[#0D0D0D] border border-[#18212E]" : "bg-white border border-[#E2E8F0]"} rounded-[12px]`}
        >
          <div
            className={`w-full border-b ${isDarkTheme ? "border-[#18212E]" : "border-[#E2E8F0]"} p-[16px]`}
          >
            <h1
              className={`text-[12px] ${isDarkTheme ? "text-[#99A1AF]" : "text-[#000]"} leading-[16px] tracking-[0.6px] uppercase font-[700]`}
            >
              Live Network Health Metrics
            </h1>
          </div>
          <div className="ml-[20px] grid w-full grid-cols-1 sm:grid-cols-3 px-[16px] pt-[16px] items-center justify-between ">
            <LiveNetworkGaugeChartAbove
              value={Number(blockTimeSeconds / 1000)?.toFixed(1) || 0}
              title="Block Time"
              score="s"
              max={15}
              progressColor="#12D091"
            />

            <LiveNetworkGaugeChartAbove
              value={Number(finalityTimeSeconds / 1000)?.toFixed(1) || 0}
              title="Finality Time"
              score="s"
              max={15}
              progressColor="#12D091"
            />

            <LiveNetworkGaugeChartAbove
              value={Number(successRateTime)?.toFixed(1) || 0}
              title="TX Success Rate"
              score="%"
              max={100}
              progressColor="#12D091"
            />
          </div>
          {/* disk data */}
          <div className="ml-[20px] grid w-full grid-cols-1 gap-2 sm:grid-cols-3 px-[16px] pb-[16px]">
            <LiveNetworkGaugeChartBelow
              value={Number(metricsHealth?.[3]?.value)?.toFixed(1) || 0}
              title="RPC Performance"
              score="ms"
              max={300}
              progressColor="#F6A923"
            />

            <LiveNetworkGaugeChartBelow
              value={Number(metricsHealth?.[6]?.value)?.toFixed(1) || 0}
              title="Network Uptime"
              score="week"
              max={100}
              progressColor="#F6A923"
            />

            <LiveNetworkGaugeChartBelow
              value={Number(metricsHealth?.[2]?.value)?.toFixed(1) || 0}
              title="Node Health"
              score="%"
              max={100}
              progressColor="#F6A923"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LiveNetworkHealthMetrics;
