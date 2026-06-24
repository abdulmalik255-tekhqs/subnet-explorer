import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactECharts from "echarts-for-react";
import useTheme from "../../../hooks/useTheme";

const TransactionActivityChart = () => {
  const dispatch = useDispatch();
  const { isDarkTheme } = useTheme();
  const { txnHistory } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch.dashboard.handleGetTxns();
    const interval = setInterval(() => {
      dispatch.dashboard.handleGetTxns();
    }, 10000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const chartData = Array.isArray(txnHistory?.dailyTxs)
    ? txnHistory.dailyTxs
    : [];

  const labels = chartData.map((item) => {
    const parsedDate = new Date(item?.date);

    return Number.isNaN(parsedDate.getTime())
      ? item?.date || ""
      : parsedDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
  });

  const current = chartData.map((item) => Number(item?.txCount) || 0);
  const previous = chartData.map((_, index) =>
    index === 0 ? current[0] || 0 : current[index - 1] || 0,
  );

  const allValues = [...current, ...previous];
  const maxValue = Math.max(...allValues, 0);
  const yMin = 0;

  const getNiceAxisStep = (value) => {
    if (value <= 10) return 2;

    const roughStep = value / 4;
    const magnitude = 10 ** Math.floor(Math.log10(roughStep));
    const normalized = roughStep / magnitude;

    if (normalized <= 1) return magnitude;
    if (normalized <= 2) return 2 * magnitude;
    if (normalized <= 5) return 5 * magnitude;

    return 10 * magnitude;
  };

  const yInterval = getNiceAxisStep(maxValue);
  const yMax = Math.max(
    yInterval * 4,
    Math.ceil(maxValue / yInterval) * yInterval,
  );
  const compactNumberFormatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  });

  const formatAxisValue = (value) => compactNumberFormatter.format(value || 0);

  const axisColor = isDarkTheme ? "#121C2B" : "#E2E8F0";
  const lineColor = isDarkTheme ? "#1B2535" : "#CBD5E1";
  const labelColor = isDarkTheme ? "#5F6776" : "#64748B";
  const tooltipBorder = isDarkTheme ? "#2A3446" : "#CBD5E1";
  const tooltipBackground = isDarkTheme
    ? "rgba(8, 12, 20, 0.96)"
    : "rgba(255, 255, 255, 0.98)";
  const tooltipText = isDarkTheme ? "#D5DAE3" : "#0F172A";

  const option = {
    grid: {
      top: 20,
      right: 20,
      bottom: 30,
      left: 52,
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      borderWidth: 1,
      borderColor: tooltipBorder,
      backgroundColor: tooltipBackground,
      textStyle: { color: tooltipText, fontSize: 11 },
      axisPointer: {
        type: "line",
        snap: true,
        lineStyle: {
          color: isDarkTheme
            ? "rgba(148, 163, 184, 0.28)"
            : "rgba(71, 85, 105, 0.2)",
          width: 1,
        },
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: labels,
      axisLine: { lineStyle: { color: lineColor } },
      axisTick: { show: false },
      axisLabel: {
        color: labelColor,
        fontSize: 10,
        fontWeight: 600,
        margin: 12,
        hideOverlap: true,
        showMinLabel: true,
        showMaxLabel: true,
        interval: 0,
        formatter: (value, index) => {
          const showEvery = Math.max(1, Math.ceil(labels.length / 4));
          return index % showEvery === 0 || index === labels.length - 1
            ? value
            : "";
        },
      },
      splitLine: {
        show: true,
        interval: (index) => {
          const showEvery = Math.max(1, Math.ceil(labels.length / 4));
          return index % showEvery === 0 || index === labels.length - 1;
        },
        lineStyle: { color: axisColor, width: 1 },
      },
    },
    yAxis: {
      type: "value",
      min: yMin,
      max: yMax,
      interval: yInterval,
      splitNumber: 4,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: labelColor,
        fontSize: 9,
        margin: 10,
        hideOverlap: true,
        formatter: (value) => formatAxisValue(value),
      },
      splitLine: {
        lineStyle: { color: axisColor, width: 1 },
      },
    },
    series: [
      {
        type: "line",
        name: "Previous",
        data: previous,
        smooth: 0.45,
        showSymbol: false,
        symbol: "none",
        sampling: "lttb",
        lineStyle: { width: 2, color: "#F6A923" },
        areaStyle: {
          opacity: 1,
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(246, 169, 35, 0.88)" },
              { offset: 0.55, color: "rgba(246, 169, 35, 0.58)" },
              { offset: 1, color: "rgba(246, 169, 35, 0.18)" },
            ],
          },
        },
        z: 1,
      },
      {
        type: "line",
        name: "Current",
        data: current,
        smooth: 0.45,
        showSymbol: false,
        symbol: "none",
        sampling: "lttb",
        lineStyle: { width: 2.2, color: "#12D091" },
        areaStyle: {
          opacity: 1,
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(18, 208, 145, 0.9)" },
              { offset: 0.52, color: "rgba(18, 208, 145, 0.62)" },
              { offset: 1, color: "rgba(18, 208, 145, 0.16)" },
            ],
          },
        },
        z: 2,
      },
    ],
  };

  return (
    <>
      <div
        className={`border ${isDarkTheme ? "border-[#18212E]" : "border-[#E2E8F0]"} w-full rounded-[12px] h-[328px] ${isDarkTheme ? "bg-[#0D0D0D]" : "bg-[#FFFFFF]"}`}
      >
        <div
          className={`w-full border-b ${isDarkTheme ? "border-[#18212E]" : "border-[#E2E8F0]"} p-[16px] flex justify-between items-center`}
        >
          <h1
            className={`${isDarkTheme ? "text-[#C4CFE1]" : "text-[#000]"} text-[10px] font-[700] leading-[15px] uppercase tracking-[2px]`}
          >
            Last 14 Days Transaction Activity
          </h1>
          <div className="flex gap-[16.01px] items-center justify-center">
            <p className="flex items-center justify-center gap-[6px] text-[#94A3B8] text-[10px] font-[700] leading-[15px] tracking-[0.5px] uppercase">
              <span className="inline-block bg-[#12D091] w-[12px] h-[12px] rounded-[4px] shrink-0" />
              Current
            </p>
            <p className="flex items-center justify-center gap-[6px] text-[#94A3B8] text-[10px] font-[700] leading-[15px] tracking-[0.5px] uppercase">
              <span className="inline-block bg-[#F6A923] w-[12px] h-[12px] rounded-[4px] shrink-0" />
              Previous
            </p>
          </div>
        </div>
        <div className="h-[calc(100%-58px)] px-[8px] pb-[8px]">
          <ReactECharts
            option={option}
            style={{ height: "100%", width: "100%" }}
          />
        </div>
      </div>
    </>
  );
};

export default TransactionActivityChart;
