import React from "react";
import ReactECharts from "echarts-for-react";

const LiveNetworkGaugeChartBelow = ({
  value,
  title,
  score,
  max = 100,
  progressColor = "#F6A923",
}) => {
  const displayTitle = typeof title === "string" ? title.toUpperCase() : title;
  const option = {
    series: [
      // OUTER ARC (3 colors - static)
      {
        type: "gauge",
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 1000,
        radius: "92%",
        center: ["50%", "68%"],
        pointer: { show: false },
        progress: { show: false },
        axisLine: {
          lineStyle: {
            width: 3,
            color: [
              [0.3, "#12D091"],
              [0.7, "#F6A923"],
              [1, "#F15B5B"],
            ],
          },
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: { show: false },
      },

      // INNER ARC (progress fill)
      {
        type: "gauge",
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max,
        radius: "85%",
        center: ["50%", "68%"],
        pointer: { show: false },
        axisLine: {
          lineStyle: {
            width: 14,
            color: [[1, "#141A26"]],
          },
        },
        progress: {
          show: true,
          width: 14,
          roundCap: false,
          itemStyle: {
            color: progressColor,
          },
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          offsetCenter: [0, "10%"],
          formatter: function (val) {
            return `{value|${val}}{score|${score ?? ""}}\n{line1|${displayTitle}}`;
          },
          rich: {
            value: {
              fontSize: 24,
              fontWeight: 700,
              color: progressColor,
              lineHeight: 48,
            },
            score: {
              fontSize: 24,
              fontWeight: 700,
              color: progressColor,
              lineHeight: 48,
              padding: [0, 0, 0, 2],
            },
            line1: {
              fontSize: 11,
              fontWeight: 600,
              color: "#9CA3AF",
              letterSpacing: 1,
              lineHeight: 16,
            },
            line2: {
              fontSize: 11,
              fontWeight: 600,
              color: "#9CA3AF",
              letterSpacing: 1,
              lineHeight: 16,
            },
          },
        },
        data: [{ value: value || 0 }],
      },
    ],
  };

  return (
    <ReactECharts option={option} style={{ height: "207px", width: "80%" }} />
  );
};

export default LiveNetworkGaugeChartBelow;
