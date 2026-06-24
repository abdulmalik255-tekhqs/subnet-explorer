import ReactECharts from "echarts-for-react";
import useTheme from "../../../hooks/useTheme";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const CurrentThroughPutChart = () => {
  const dispatch = useDispatch();
  const { metricsHistory } = useSelector((state) => state.dashboard);
  const totalTPS = metricsHistory?.reduce(
    (sum, item) => sum + Number(item?.value || 0),
    0,
  );
  const averageTPS =
    metricsHistory?.length > 0 ? totalTPS / metricsHistory.length : 0;
  useEffect(() => {
    const fetchMetricsHistory = () => {
      const endTime = Date.now().toString();
      const startTime = (Date.now() - 28000).toString();

      dispatch.dashboard.handleGetMetricsHistory({
        metric: "tps",
        startTime,
        endTime,
      });
    };

    fetchMetricsHistory();
    const interval = setInterval(fetchMetricsHistory, 10000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const { isDarkTheme } = useTheme();
  const axisColor = isDarkTheme ? "#121C2B" : "#E2E8F0";
  const chartData = Array.isArray(metricsHistory) ? metricsHistory : [];
  const hasChartData = chartData.length > 0;
  const fallbackLabels = Array.from({ length: 8 }, (_, i) => `${i * 5}s`);

  const labels = hasChartData
    ? chartData.map((item) => {
        const parsedTimestamp = new Date(
          Number(item?.timestamp) || item?.timestamp,
        );

        return Number.isNaN(parsedTimestamp.getTime())
          ? ""
          : parsedTimestamp.toLocaleTimeString("en-US", {
              minute: "2-digit",
              second: "2-digit",
            });
      })
    : fallbackLabels;

  const values = hasChartData
    ? chartData.map((item) => Number(item?.value) || 0)
    : Array(fallbackLabels.length).fill(0);
  const maxValue = Math.max(...values, 0);

  const option = {
    grid: {
      top: 18,
      right: 14,
      bottom: 24,
      left: 36,
    },
    tooltip: {
      trigger: "axis",
      borderWidth: 1,
      borderColor: axisColor,
      backgroundColor: isDarkTheme ? "#0D0D0D" : "#FFFFFF",
      textStyle: { color: isDarkTheme ? "#99A1AF" : "#1E293B", fontSize: 11 },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: labels,
      axisLine: { lineStyle: { color: axisColor } },
      axisTick: { show: false },
      axisLabel: {
        color: isDarkTheme ? "#5F6776" : "#64748B",
        fontSize: 8,
        interval: 1,
      },
      splitLine: { show: true, lineStyle: { color: axisColor, width: 1 } },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: Math.max(10, Math.ceil(maxValue * 1.1)),
      splitNumber: 4,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: isDarkTheme ? "#5F6776" : "#64748B", fontSize: 9 },
      splitLine: { lineStyle: { color: axisColor, width: 1 } },
    },
    series: [
      {
        type: "line",
        step: "end",
        data: values,
        symbol: "none",
        lineStyle: { width: 2, color: "#EE5FA7" },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#EC489999" },
              { offset: 1, color: "#EC48991A" },
            ],
          },
        },
      },
    ],
    graphic: hasChartData
      ? []
      : [
          {
            type: "text",
            right: 16,
            top: 12,
            style: {
              text: "",
              fill: isDarkTheme ? "#6A7282" : "#64748B",
              fontSize: 10,
              fontWeight: 600,
            },
          },
        ],
  };

  return (
    <>
      <div
        className={`border ${isDarkTheme ? "border-[#18212E]" : "border-[#E2E8F0]"} w-full rounded-[12px] h-[358px] ${isDarkTheme ? "bg-[#0D0D0D]" : "bg-[#FFFFFF]"}`}
      >
        <div
          className={`w-full border-b ${isDarkTheme ? "border-[#18212E]" : "border-[#E2E8F0]"} p-[16px] `}
        >
          <h1 className="text-[10px] text-[#99A1AF] leading-[15px] tracking-[2px] uppercase font-[700]">
            TPS (Live)
          </h1>
          <div className="flex justify-between items-center gap-[16.01px]">
            <div className="flex gap-[16.01px]">
              <p
                className={`flex items-center gap-[8px] ${isDarkTheme ? "text-[#94A3B8]" : "text-[#1E293B]"} text-[10px] font-[700] leading-[15px] tracking-[0.5px] uppercase`}
              >
                Real-time
                <span className="inline-block bg-[#F74BA7] w-[8px] h-[8px] rounded-full shrink-0" />
              </p>
            </div>
            <div className="flex flex-col items-end">
              <h1 className="text-[#F74BA7] text-[12px] font-[700] leading-[16px]">
                {averageTPS.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}{" "}
                TPS
              </h1>
              <p
                className={`text-[8px] ${isDarkTheme ? "text-[#6A7282]" : "text-[#1E293B]"} font-[700] leading-[12px] uppercase tracking-[0.8px]`}
              >
                current throughput
              </p>
            </div>
          </div>
        </div>
        <div className="h-[calc(100%-76px)] px-[6px] pb-[8px]">
          <ReactECharts
            option={option}
            style={{ height: "100%", width: "100%" }}
          />
        </div>
      </div>
    </>
  );
};

export default CurrentThroughPutChart;
