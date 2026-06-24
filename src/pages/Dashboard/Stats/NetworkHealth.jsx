import ReactECharts from "echarts-for-react";
import useTheme from "../../../hooks/useTheme";
import { useSelector } from "react-redux";

const SUCCESS_COLOR = "#00D46A";
const FAILED_COLOR = "#F6A923";

const NetworkHealth = () => {
  const { isDarkTheme } = useTheme();
  const { successRateTime } = useSelector((state) => state.dashboard);
  const rawSuccessValue = successRateTime;
  const successRate = Math.min(
    100,
    Math.max(0, Number(rawSuccessValue?.[2]?.value ?? rawSuccessValue ?? 0)),
  );
  const isFailedState = successRate <= 0;
  const displayPercent =
    successRate === 100 || successRate === 0
      ? `${successRate}`
      : Number(successRate).toFixed(1);
  const failedRate =
    successRate === 100 ? 0 : Number((100 - successRate).toFixed(1));
  const centerLabel = isFailedState ? "FAILED" : "SUCCESSFUL";
  const centerLabelColor = isFailedState ? FAILED_COLOR : SUCCESS_COLOR;

  const option = {
    backgroundColor: "transparent",
    series: [
      {
        type: "pie",
        radius: ["62%", "88%"],
        center: ["50%", "50%"],
        startAngle: 40,
        data: [
          {
            value: Number(displayPercent),
            name: "Successful",
            itemStyle: { color: SUCCESS_COLOR },
          },
          {
            value: failedRate,
            name: "Failed",
            itemStyle: { color: FAILED_COLOR },
          },
        ],
        label: { show: false },
        labelLine: { show: false },
        emphasis: { scale: false },
      },
    ],
    graphic: [
      {
        type: "text",
        left: "center",
        top: "38%",
        style: {
          text: `${displayPercent}%`,
          fill: `${isDarkTheme ? "#FFFFFF" : "#000000"}`,
          fontSize: 24,
          fontWeight: "700",
          textAlign: "center",
        },
      },
      {
        type: "text",
        left: "center",
        top: "55%",
        style: {
          text: centerLabel,
          fill: centerLabelColor,
          fontSize: 11,
          fontWeight: "700",
          letterSpacing: 1,
          textAlign: "center",
        },
      },
    ],
  };

  return (
    <div
      className={`${isDarkTheme ? "bg-[#0D0D0D] border border-[#18212E]" : "bg-white border border-[#E2E8F0]"} rounded-[12px]`}
    >
      {/* Header */}
      <div
        className={`${isDarkTheme ? "border-b border-[#18212E]" : "border-b border-[#E2E8F0]"} p-[16px] text-center`}
      >
        <h1
          className={`text-[12px] font-[700] ${isDarkTheme ? "text-white" : "text-[#000]"} leading-[16px] tracking-[0.6px] uppercase`}
        >
          Success Rate
        </h1>
      </div>

      {/* Donut chart */}
      <div className="px-[16px] pt-[16px]">
        <ReactECharts
          option={option}
          style={{ height: "260px", width: "100%" }}
        />
      </div>

      {/* Legend */}
      <div className="flex justify-center items-center gap-[32px] pb-[20px]">
        <div className="flex items-center gap-[6px]">
          <span
            className="w-[8px] h-[8px] rounded-full"
            style={{ backgroundColor: SUCCESS_COLOR }}
          />
          <span
            className={`text-[10px] font-[700] tracking-[0.5px] uppercase ${isDarkTheme ? "text-[#99A1AF]" : "text-[#99A1AF]"}`}
          >
            Successful
          </span>
        </div>
        <div className="flex items-center gap-[6px]">
          <span
            className="w-[8px] h-[8px] rounded-full"
            style={{ backgroundColor: FAILED_COLOR }}
          />
          <span className="text-[#9CA3AF] text-[10px] font-[700] tracking-[0.5px] uppercase">
            Failed
          </span>
        </div>
      </div>
    </div>
  );
};

export default NetworkHealth;
