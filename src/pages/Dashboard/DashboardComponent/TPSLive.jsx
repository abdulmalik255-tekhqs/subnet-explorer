import React from "react";
import ReactECharts from "echarts-for-react";

const GaugeChart = ({ value = 894 }) => {
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
            width: 7,
            color: [
              [0.3, "#F15B5B"],
              [0.7, "#F6A923"],
              [1, "#12D091"],
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
        max: 1000,
        radius: "80%",
        center: ["50%", "68%"],
        pointer: { show: false },
        axisLine: {
          lineStyle: {
            width: 14,
            color: [[1, "#747D8B"]],
          },
        },
        progress: {
          show: true,
          width: 14,
          roundCap: false,
          itemStyle: {
            color: "#F6A923",
          },
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          offsetCenter: [0, "28%"],
          formatter: function (val) {
            return `{value|${val}}\n{line1|TRANSACTIONS PER}\n{line2|SECOND}`;
          },
          rich: {
            value: {
              fontSize: 36,
              fontWeight: 700,
              color: "#F6A923",
              lineHeight: 48,
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
        data: [{ value }],
      },
    ],
  };

  return (
    <ReactECharts option={option} style={{ height: "80%", width: "100%" }} />
  );
};

export default GaugeChart;
