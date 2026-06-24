import GaugeChart from "../DashboardComponent/TPSLive";
import useTheme from "../../../hooks/useTheme";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const TPS = () => {
  const { isDarkTheme } = useTheme();
  const { blockTimeSeconds, TPSvalue } = useSelector(
    (state) => state.dashboard,
  );
  const divideValue = blockTimeSeconds / 1000;
  const calculatedTPS =
    divideValue > 0 ? (TPSvalue / divideValue).toFixed(1) : 0;
  useEffect(() => {}, [TPSvalue, blockTimeSeconds]);
  return (
    <div
      className={`${isDarkTheme ? "bg-[#0D0D0D] border border-[#18212E]" : "bg-white border border-[#E2E8F0]"} tracking-[1.2px] rounded-[12px] p-[16px] h-[272px] flex flex-col`}
    >
      <p
        className={`${isDarkTheme ? "text-[#C4CFE1]" : "text-[#1E293B]"} text-[12px] font-[700] mb-2 text-center`}
      >
        TPS (LIVE)
      </p>
      <div className="flex-1">
        <GaugeChart value={calculatedTPS} />
      </div>
    </div>
  );
};

export default TPS;
