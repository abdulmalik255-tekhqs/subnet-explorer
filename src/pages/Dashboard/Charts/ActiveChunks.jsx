import React, { useEffect } from "react";
import ReactECharts from "echarts-for-react";
import useTheme from "../../../hooks/useTheme";
import { useDispatch, useSelector } from "react-redux";

const ActiveChunks = () => {
  const dispatch = useDispatch();
  const { isDarkTheme } = useTheme();
  const { txnHistory } = useSelector((state) => state.dashboard);
  useEffect(() => {
    dispatch.dashboard.handleGetTxns();
    const interval = setInterval(() => {
      dispatch.dashboard.handleGetTxns();
    }, 10000);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);
  const axisColor = isDarkTheme ? "#121C2B" : "#E2E8F0";
  const chartData = Array.isArray(txnHistory?.dailyTxs)
    ? txnHistory.dailyTxs
    : Array.isArray(txnHistory)
      ? txnHistory
      : [];

  const labels = chartData.map((item) => {
    const parsedDate = new Date(item?.date);

    return Number.isNaN(parsedDate.getTime())
      ? item?.date
      : parsedDate.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        });
  });

  const values = chartData.map((item) => Number(item?.txCount) || 0);

  const option = {
    grid: {
      top: 18,
      right: 18,
      bottom: 26,
      left: 35,
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
        color: isDarkTheme ? "#4B5563" : "#64748B",
        fontSize: 9,
        interval: 0,
        rotate: 45,
      },
      splitLine: {
        show: true,
        interval: 0,
        lineStyle: { color: axisColor, width: 1 },
      },
    },
    yAxis: {
      type: "value",
      min: 0,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: isDarkTheme ? "#4B5563" : "#64748B",
        fontSize: 9,
      },
      splitLine: { lineStyle: { color: axisColor, width: 1 } },
    },
    series: [
      {
        type: "line",
        data: values,
        smooth: 0.35,
        symbol: "none",
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
  };

  return (
    <>
      <div
        className={`border ${isDarkTheme ? "border-[#18212E]" : "border-[#E2E8F0]"} w-full rounded-[12px] h-[358px] ${isDarkTheme ? "bg-[#0D0D0D]" : "bg-[#FFFFFF]"}`}
      >
        <div
          className={`w-full border-b ${isDarkTheme ? "border-[#18212E]" : "border-[#E2E8F0]"} p-[16px]`}
        >
          <h1 className="text-[10px] text-[#99A1AF] leading-[15px] tracking-[2px] uppercase font-[700]">
            Total Transactions
          </h1>
          <h1
            className={`flex items-end gap-[8px] text-[18px] ${isDarkTheme ? "text-white" : "text-[#000]"} leading-[28px] font-[700]`}
          >
            Last 14
            <span className="text-[10px] text-[#B760FF] font-[700] leading-[15px] uppercase tracking-[1px]">
              days
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

export default ActiveChunks;
