import React, { useEffect } from "react";
import useTheme from "../../../hooks/useTheme";
import { useDispatch, useSelector } from "react-redux";

const NodeInfrastructure = () => {
  const dispatch = useDispatch();
  const { nodeInfrastructureData } = useSelector((state) => state.dashboard);
  const handleFetchNode = () => {
    dispatch.dashboard.handleGetAllNodeInfrastructure();
  };
  useEffect(() => {
    handleFetchNode();
    const interval = setInterval(() => {
      handleFetchNode();
    }, 10000);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);
  const { isDarkTheme } = useTheme();
  return (
    <>
      <div className="w-full">
        <div
          className={`${isDarkTheme ? "bg-[#0D0D0D] border border-[#18212E]" : "bg-white border border-[#E2E8F0]"} rounded-[12px]`}
        >
          <div
            className={`${isDarkTheme ? "border-b border-[#18212E]" : "border-b border-[#E2E8F0]"} p-[16px]`}
          >
            <h1
              className={`text-[12px] ${isDarkTheme ? "text-white" : "text-[#000]"} leading-[16px] font-[700] tracking-[0.6px] uppercase`}
            >
              Node Infrastructure
            </h1>
          </div>
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-4 px-[16px] pt-[16px]">
            <div
              className="min-h-[138px] w-full p-[16px] flex flex-col justify-center items-start gap-[4px]"
              style={{
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.10)",
                background: "linear-gradient(135deg, #3498DB 0%, #2980B9 100%)",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)",
              }}
            >
              <h1 className="text-[10px] font-[700] text-white/80 leading-[15px] tracking-[0.5px] uppercase">
                CPU Usage
              </h1>
              <p className="text-[30px] font-[700] text-white p-0 m-0 leading-[36px] tracking-[0.5px]">
                {nodeInfrastructureData?.cpu_usage}{" "}
                <span className="text-[14px] uppercase leading-[20px] text-white/90">
                  {" "}
                  %
                </span>
              </p>
            </div>
            <div
              className="min-h-[138px] w-full p-[16px] flex flex-col justify-center items-start gap-[4px]"
              style={{
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.10)",
                background: "linear-gradient(135deg, #3498DB 0%, #2980B9 100%)",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)",
              }}
            >
              <h1 className="text-[10px] font-[700] text-white/80 leading-[15px] tracking-[0.5px] uppercase">
                CPU Cores
              </h1>
              <p className="text-[30px] font-[700] text-white p-0 m-0 leading-[36px] tracking-[0.5px]">
                {nodeInfrastructureData?.cpu_cores}
              </p>
            </div>
            <div
              className="min-h-[138px] w-full p-[16px] flex flex-col justify-center items-start gap-[4px]"
              style={{
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.10)",
                background: "linear-gradient(135deg, #3498DB 0%, #2980B9 100%)",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)",
              }}
            >
              <h1 className="text-[10px] font-[700] text-white/80 leading-[15px] tracking-[0.5px]">
                Total RAM
              </h1>
              <p className="text-[30px] font-[700] text-white p-0 m-0 leading-[36px] tracking-[0.5px]">
                {nodeInfrastructureData?.total_ram}
                <span className="text-[14px] uppercase leading-[20px] text-white/90">
                  {" "}
                  GiB
                </span>
              </p>
            </div>
            <div
              className="min-h-[138px] w-full p-[16px] flex flex-col justify-center items-start gap-[4px]"
              style={{
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.10)",
                background: "linear-gradient(135deg, #3498DB 0%, #2980B9 100%)",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)",
              }}
            >
              <h1 className="text-[10px] font-[700] text-white/80 leading-[15px] tracking-[0.5px]">
                Used RAM
              </h1>
              <p className="text-[30px] font-[700] text-white p-0 m-0 leading-[36px] tracking-[0.5px]">
                {nodeInfrastructureData?.ram_used || 0}
                <span className="text-[14px] uppercase leading-[20px] text-white/90">
                  {" "}
                  GiB
                </span>
              </p>
            </div>
          </div>
          {/* disk data */}
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3 p-[16px]">
            <div
              className="min-h-[100px] w-full p-[16px] flex flex-col justify-center items-start gap-[4px]"
              style={{
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.10)",
                background: "linear-gradient(135deg, #3498DB 0%, #2980B9 100%)",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)",
              }}
            >
              <h1 className="text-[10px] font-[700] text-white/80 leading-[15px] tracking-[0.5px] uppercase">
                Disk Total /
              </h1>
              <p className="text-[30px] font-[700] text-white p-0 m-0 leading-[36px] tracking-[0.5px]">
                {nodeInfrastructureData?.disk_total}{" "}
                <span className="text-[14px] uppercase leading-[20px] text-white/90 font-[700]">
                  GB
                </span>
              </p>
            </div>
            <div
              className="min-h-[100px] w-full p-[16px] flex flex-col justify-center items-start gap-[4px]"
              style={{
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.10)",
                background: "linear-gradient(135deg, #3498DB 0%, #2980B9 100%)",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)",
              }}
            >
              <h1 className="text-[10px] font-[700] text-white/80 leading-[15px] tracking-[0.5px] uppercase">
                Disk Usage /
              </h1>
              <p className="text-[30px] font-[700] text-white p-0 m-0 leading-[36px] tracking-[0.5px]">
                {nodeInfrastructureData?.disk_usage}{" "}
                <span className="text-[14px] uppercase leading-[20px] text-white/90 font-[700]">
                  {" "}
                  GB
                </span>
              </p>
            </div>
            <div
              className="min-h-[100px] w-full p-[16px] flex flex-col justify-center items-start gap-[4px]"
              style={{
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.10)",
                background: "linear-gradient(135deg, #3498DB 0%, #2980B9 100%)",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)",
              }}
            >
              <h1 className="text-[10px] font-[700] text-white/80 leading-[15px] tracking-[0.5px] uppercase">
                Disk Usage / Percentage
              </h1>
              <p className="text-[30px] font-[700] text-white p-0 m-0 leading-[36px] tracking-[0.5px]">
                {nodeInfrastructureData?.disk_usage_percentage}{" "}
                <span className="text-[14px] uppercase leading-[20px] text-white/90 font-[700]">
                  %
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NodeInfrastructure;
