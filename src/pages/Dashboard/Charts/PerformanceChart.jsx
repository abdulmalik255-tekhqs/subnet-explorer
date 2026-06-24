import ReactECharts from "echarts-for-react";
import useTheme from "../../../hooks/useTheme";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const PerformanceChart = () => {
  const { isDarkTheme } = useTheme();
  const dispatch = useDispatch();
  const { avgLatency } = useSelector((state) => state.dashboard);
  const chartData = Array.isArray(avgLatency) ? avgLatency : [];
  const totalTPS = chartData.reduce(
    (sum, item) => sum + Number(item?.value ?? item ?? 0),
    0,
  );
  const averageTPS = chartData.length > 0 ? totalTPS / chartData.length : 0;

  useEffect(() => {
    const fetchMetricsHistory = () => {
      const now = Date.now();
      const startTime = (now - 90000).toString();
      const endTime = now.toString();

      dispatch.dashboard.handleGetAvgLatency({
        metric: "success_rate",
        startTime,
        endTime,
      });
    };

    fetchMetricsHistory();
    const interval = setInterval(fetchMetricsHistory, 10000);

    return () => clearInterval(interval);
  }, [dispatch]);
  const labels = Array.from({ length: 20 }, (_, i) => `${i * 5}s`);
  const hasChartData = chartData.length > 0;
  const seriesValues = hasChartData
    ? chartData.map((item) => Number(item?.value ?? item ?? 0))
    : Array(labels.length).fill(0);

  const axisColor = isDarkTheme ? "#121C2B" : "#E2E8F0";
  const option = {
    grid: {
      top: 18,
      right: 24,
      bottom: 22,
      left: 36,
    },
    tooltip: {
      trigger: "axis",
      borderWidth: 1,
      borderColor: axisColor,
      backgroundColor: isDarkTheme ? "#0D0D0D" : "#FFFFFF",
      textStyle: { color: isDarkTheme ? "#99A1AF" : "#1E293B", fontSize: 11 },
      formatter: (params = []) => {
        const items = Array.isArray(params) ? params : [params];
        const axisLabel = items?.[0]?.axisValueLabel ?? "";

        const seriesLines = items
          .map((item) => {
            const value = Array.isArray(item?.value)
              ? item.value[1]
              : item?.value;
            return `${item.marker} ${item.seriesName}&nbsp;&nbsp;&nbsp;<strong>${Number(value ?? 0).toFixed(1)}%</strong>`;
          })
          .join("<br/>");

        return `${axisLabel}<br/>${seriesLines}`;
      },
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
    yAxis: [
      {
        type: "value",
        min: 0,
        max: 100,
        interval: 25,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: isDarkTheme ? "#5F6776" : "#64748B",
          fontSize: 9,
          formatter: "{value}%",
        },
        splitLine: false,
      },
    ],
    series: [
      {
        type: "line",
        name: "Success Rate",
        data: seriesValues,
        symbol: "none",
        smooth: 0.4,
        lineStyle: { width: 2, color: "#B56DF8" },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#A855F799" },
              { offset: 1, color: "#A855F71A" },
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
          className={`w-full border-b ${isDarkTheme ? "border-[#18212E]" : "border-[#E2E8F0]"} p-[16px] flex justify-between items-center`}
        >
          <div className="">
            <h1 className="text-[10px] text-[#99A1AF] leading-[15px] tracking-[2px] uppercase font-[700] mb-[4px]">
              Success rate
            </h1>
            <div className="flex gap-[16.01px]">
              <p
                className={`flex items-center gap-[6px] ${isDarkTheme ? "text-[#94A3B8]" : "text-[#1E293B]"} text-[10px] font-[700] leading-[15px] tracking-[0.5px] uppercase`}
              >
                <span
                  className={`inline-block bg-[#7B78FF] w-[8px] h-[8px] rounded-full shrink-0`}
                />
                Success Rate
              </p>
            </div>
          </div>
          <h1 className="text-[#B760FF] text-[14px] font-[700] leading-[20px]">
            {averageTPS.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
            %{" "}
            <span className="text-[8px] text-[#6A7282] font-[700] leading-[12px] uppercase">
              avg success rate
            </span>
          </h1>
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

export default PerformanceChart;
