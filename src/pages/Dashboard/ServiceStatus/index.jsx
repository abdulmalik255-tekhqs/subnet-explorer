import useTheme from "../../../hooks/useTheme";
import { useSelector } from "react-redux";

const ServiceStatus = () => {
  const { serviceStatus } = useSelector((state) => state.dashboard);
  const { isDarkTheme } = useTheme();
  return (
    <>
      <div className="w-full">
        <div
          className={`w-full ${isDarkTheme ? "bg-[#0D0D0D] border border-[#18212E]" : "bg-white border border-border-[#E2E8F0]"} rounded-[12px]`}
        >
          <div
            className={`w-full border-b ${isDarkTheme ? "border-[#18212E]" : "border-[#E2E8F0]"} p-[16px]`}
          >
            <h1
              className={`text-[12px] ${isDarkTheme ? "text-white" : "text-[#000]"} leading-[16px] font-[700] tracking-[0.6px] uppercase`}
            >
              Services Status
            </h1>
          </div>
          {serviceStatus?.length > 0 && (
            <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-4 px-[16px] pt-[16px]">
              {serviceStatus?.map((service, index) => (
                <div
                  key={index}
                  className={`min-h-[106px] w-full p-[12px] flex flex-col justify-between items-start gap-[4px] ${isDarkTheme ? "bg-[#0D0D0D] border border-[#18212E]" : "bg-white border border-[#E2E8F0]"} rounded-[4px]`}
                >
                  <h1
                    className={`text-[8px] font-[700] ${isDarkTheme ? "text-[#6A7282]" : "text-[#6A7282]"} leading-[12px] tracking-[0.8px] uppercase`}
                  >
                    {service?.name}
                  </h1>
                  <p
                    className={`text-[24px] font-[700] ${isDarkTheme ? "text-white" : "text-[#000]"} p-0 m-0 leading-[32px] tracking-[0.5px]`}
                  >
                    {service?.upTime}
                    <span className="text-[12px] uppercase leading-[16px] text-[#6A7282] font-[700] ml-[4px]">
                      week
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
          {serviceStatus?.length > 0 && (
            <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-4 p-[16px]">
              {serviceStatus?.map((service, index) => (
                <div
                  key={index}
                  className={`min-h-[106px] w-full p-[12px] flex flex-col justify-between items-start gap-[4px] ${isDarkTheme ? "bg-[#18212E] border border-[#18212E]" : "bg-[#E2E8F0] border border-[#E2E8F0]"} rounded-[4px]`}
                >
                  <h1
                    className={`text-[8px] font-[700] ${isDarkTheme ? "text-[#6A7282]" : "text-[#6A7282]"} leading-[12px] tracking-[0.8px] uppercase`}
                  >
                    {service?.name}
                    {index === 0 &&
                      ` [${service?.nodesRunning}/${service?.totalNodes}]`}
                  </h1>
                  <p
                    className={`uppercase text-[24px] font-[700] ${service?.status?.toLowerCase() === "up" || service?.status?.toLowerCase() === "online" ? "text-green-500" : "text-red-500"} p-0 m-0 leading-[32px] tracking-[0.5px]`}
                  >
                    {service?.status?.toLowerCase() === "online"
                      ? "up"
                      : service?.status?.toLowerCase() === "up"
                        ? "up"
                        : service?.status?.toLowerCase() === "offline"
                          ? "Down"
                          : service?.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ServiceStatus;
