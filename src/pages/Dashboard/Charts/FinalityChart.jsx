import ReactECharts from "echarts-for-react";
import useTheme from "../../../hooks/useTheme";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const FinalityChart = () => {
  const { isDarkTheme } = useTheme();
  const dispatch = useDispatch();
  const { blockTime: metricHistory } = useSelector((state) => state.dashboard);

  useEffect(() => {
    const fetchMetricsHistory = () => {
      const now = Date.now();
      const startTime = (now - 90000).toString();
      const endTime = now.toString();

      dispatch.dashboard.handleGetBlockTimeHistory({
        metric: ["block_time", "finality"],
        startTime,
        endTime,
      });
    };

    fetchMetricsHistory();
    const interval = setInterval(fetchMetricsHistory, 10000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const axisColor = isDarkTheme ? "#121C2B" : "#E2E8F0";
  const chartData = Array.isArray(metricHistory) ? [...metricHistory] : [];
  const normalizeMetricValue = (value) => {
    const numericValue = Number(value) || 0;
    return numericValue >= 1000 ? numericValue / 1000 : numericValue;
  };

  const groupedMetrics = chartData
    .filter((item) => item?.timestamp && item?.metric)
    .sort((a, b) => Number(a?.timestamp || 0) - Number(b?.timestamp || 0))
    .reduce((acc, item) => {
      const key = String(item?.timestamp);

      if (!acc[key]) {
        acc[key] = {
          timestamp: key,
          block_time: null,
          finality: null,
        };
      }

      acc[key][item?.metric] = normalizeMetricValue(item?.value);
      return acc;
    }, {});

  const metricRows = Object?.values(groupedMetrics);
  const hasMetricRows = metricRows.length > 0;
  const fallbackLabels = Array.from({ length: 10 }, (_, i) => `${i * 10}s`);
  const firstTimestamp = Number(metricRows?.[0]?.timestamp || 0);

  const labels = hasMetricRows
    ? metricRows.map((item) => {
        const currentTimestamp = Number(item?.timestamp || 0);

        return firstTimestamp && currentTimestamp >= firstTimestamp
          ? `${Math?.round((currentTimestamp - firstTimestamp) / 1000)}s`
          : "";
      })
    : fallbackLabels;

  const blockTimeValues = hasMetricRows
    ? metricRows?.map((item) => item?.block_time)
    : Array(fallbackLabels.length).fill(0);
  const finalityValues = hasMetricRows
    ? metricRows?.map((item) => item?.finality)
    : Array(fallbackLabels.length).fill(0);
  const hasBlockTime = hasMetricRows
    ? blockTimeValues?.some(
        (value) => typeof value === "number" && !Number.isNaN(value),
      )
    : true;
  const hasFinality = hasMetricRows
    ? finalityValues?.some(
        (value) => typeof value === "number" && !Number.isNaN(value),
      )
    : true;
  const visibleValues = [...blockTimeValues, ...finalityValues].filter(
    (value) => typeof value === "number" && !Number.isNaN(value),
  );
  const averageSource = hasBlockTime
    ? blockTimeValues
    : hasFinality
      ? finalityValues
      : [];
  const numericAverageValues = averageSource.filter(
    (value) => typeof value === "number" && !Number.isNaN(value),
  );
  const averageBlockTime =
    numericAverageValues?.length > 0
      ? numericAverageValues?.reduce((sum, value) => sum + value, 0) /
        numericAverageValues?.length
      : 0;
  const maxValue = Math.max(...visibleValues, 0);
  const axisMax = Math.max(8, Math.ceil(maxValue / 2) * 2);
  const axisInterval = Math.max(2, axisMax / 4);

  const option = {
    grid: {
      top: 18,
      right: 12,
      bottom: 22,
      left: 34,
    },
    tooltip: {
      trigger: "axis",
      borderWidth: 1,
      borderColor: axisColor,
      backgroundColor: isDarkTheme ? "#0D0D0D" : "#FFFFFF",
      textStyle: { color: isDarkTheme ? "#99A1AF" : "#1E293B", fontSize: 11 },
      formatter: (params) => {
        const items = Array.isArray(params) ? params : [params];
        const rows = items
          .filter((item) => typeof item?.data === "number")
          .map(
            (item) =>
              `${item?.marker} ${item?.seriesName}: ${item?.data?.toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 2,
                },
              )}s`,
          );

        return [items?.[0]?.axisValueLabel, ...rows]
          .filter(Boolean)
          .join("<br/>");
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
    yAxis: {
      type: "value",
      min: 0,
      max: axisMax,
      interval: axisInterval,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: isDarkTheme ? "#5F6776" : "#64748B",
        fontSize: 9,
        formatter: "{value}s",
      },
      splitLine: { lineStyle: { color: axisColor, width: 1 } },
    },
    series: [
      ...(hasBlockTime
        ? [
            {
              type: "line",
              name: "Block Time",
              step: "end",
              data: blockTimeValues,
              symbol: "none",
              lineStyle: { width: 2, color: "#F74BA7" },
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
          ]
        : []),
      ...(hasFinality
        ? [
            {
              type: "line",
              name: "Finality",
              step: "end",
              data: finalityValues,
              symbol: "none",
              lineStyle: { width: 2, color: "#B760FF" },
              areaStyle: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: "#B760FF99" },
                    { offset: 1, color: "#B760FF1A" },
                  ],
                },
              },
            },
          ]
        : []),
    ],
    graphic: hasMetricRows
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
              Block Time + Finality
            </h1>
            <div className="flex gap-[16.01px]">
              <p
                className={`flex items-center gap-[6px] ${isDarkTheme ? "text-[#fff]" : "text-[#000000]"} text-[10px] font-[700] leading-[15px] tracking-[0.5px] uppercase`}
              >
                <span className="inline-block bg-[#F74BA7] w-[8px] h-[8px] rounded-full shrink-0" />
                Block Time
              </p>

              <p
                className={`flex items-center gap-[6px] ${isDarkTheme ? "text-[#fff]" : "text-[#000000]"} text-[10px] font-[700] leading-[15px] tracking-[0.5px] uppercase`}
              >
                <span className="inline-block bg-[#B760FF] w-[8px] h-[8px] rounded-full shrink-0" />
                Finality
              </p>
            </div>
          </div>
          <h1
            className={`${hasBlockTime ? "text-[#F74BA7]" : "text-[#B760FF]"} text-[14px] font-[700] leading-[20px]`}
          >
            {averageBlockTime.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
            s
            <span className="ml-[4px] text-[8px] text-[#6A7282] font-[700] leading-[12px] uppercase">
              avg
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

export default FinalityChart;
