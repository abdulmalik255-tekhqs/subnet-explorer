import { useDispatch, useSelector } from "react-redux";
import ASSETS from "../../../assets";
import useTheme from "../../../hooks/useTheme";
import { useEffect } from "react";

const TransactionLiveCycleFlow = () => {
  const dispatch = useDispatch();
  const { transactionLifeCycleData } = useSelector((state) => state.dashboard);
  const { isDarkTheme } = useTheme();
  const handleLifeCycle = () => {
    dispatch.dashboard.handleGetTransactionLifeCycleFlow();
  };
  useEffect(() => {
    handleLifeCycle();
    const interval = setInterval(() => {
      handleLifeCycle();
    }, 10000);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <div className="w-full">
        <div
          className={`${isDarkTheme ? "bg-[#0D0D0D] border border-[#18212E]" : "bg-white border border-[#E2E8F0]"} rounded-[12px]`}
        >
          <div
            className={`w-full border-b ${isDarkTheme ? "border-[#18212E]" : "border-[#E2E8F0]"} p-[16px] text-center`}
          >
            <h1
              className={`${isDarkTheme ? "text-[#C4CFE1]" : "text-[#1E293B]"} text-[12px] leading-[16px] tracking-[0.6px] uppercase font-[700]`}
            >
              Transaction Lifecycle Flow
            </h1>
          </div>
          <div className="w-full flex flex-col justify-center items-center py-[24px] gap-[0px]">
            {/* Step 1 */}
            <div className="relative mb-[16px]">
              <h1
                className={`${isDarkTheme ? "bg-[#18212E] text-[#C6D2E1]" : "bg-[#E2E8F0] text-[#1E293B]"} p-[20px] flex justify-center items-center rounded-[4px] w-[157px] h-[67px] text-[10px] font-[700] leading-[15px] tracking-[0.5px] uppercase text-center`}
              >
                Submitted TXs
              </h1>
              <p
                className={`${isDarkTheme ? "bg-[#0D0D0D] border border-[#18212E] text-[#C6D2E1]" : "bg-white border border-[#E5E7EB] text-[#1E293B]"} absolute bottom-[-12px] left-1/2 -translate-x-1/2 flex justify-center items-center rounded-[4px] w-[64px] h-[24px] text-[10px] font-[700] leading-[15px] tracking-[0.5px] uppercase`}
              >
                {Number(transactionLifeCycleData?.submitted).toFixed(1) || 0}%
              </p>
            </div>
            <img src={ASSETS.downArrow} alt="arrow" className="my-[8px]" />

            {/* Step 2 */}
            <div className="relative mb-[16px]">
              <h1
                className={`${isDarkTheme ? "bg-[#18212E] text-[#C6D2E1]" : "bg-[#E2E8F0] text-[#1E293B]"} p-[20px] flex justify-center items-center rounded-[4px] w-[157px] h-[67px] text-[10px] font-[700] leading-[15px] tracking-[0.5px] uppercase text-center`}
              >
                Validated
              </h1>
              <p
                className={`${isDarkTheme ? "bg-[#0D0D0D] border border-[#18212E] text-[#C6D2E1]" : "bg-white border border-[#E2E8F0] text-[#1E293B]"} absolute bottom-[-12px] left-1/2 -translate-x-1/2 flex justify-center items-center rounded-[4px] w-[64px] h-[24px] text-[10px] font-[700] leading-[15px] tracking-[0.5px] uppercase`}
              >
                {Number(transactionLifeCycleData?.validated).toFixed(1) || 0}%
              </p>
            </div>
            <img src={ASSETS.downArrow} alt="arrow" className="my-[8px]" />

            {/* Step 3 */}
            <div className="relative mb-[16px]">
              <h1
                className={`${isDarkTheme ? "bg-[#18212E] text-[#C6D2E1]" : "bg-[#E2E8F0] text-[#1E293B]"} p-[20px] flex justify-center items-center rounded-[4px] w-[157px] h-[67px] text-[10px] font-[700] leading-[15px] tracking-[0.5px] uppercase text-center`}
              >
                Included in Block
              </h1>
              <p
                className={`${isDarkTheme ? "bg-[#0D0D0D] border border-[#18212E] text-[#C6D2E1]" : "bg-white border border-[#E2E8F0] text-[#1E293B]"} absolute bottom-[-12px] left-1/2 -translate-x-1/2 flex justify-center items-center rounded-[4px] w-[64px] h-[24px] text-[10px] font-[700] leading-[15px] tracking-[0.5px] uppercase`}
              >
                {Number(transactionLifeCycleData?.included_in_block).toFixed(
                  1,
                ) || 0}
                %
              </p>
            </div>
            <img src={ASSETS.downArrow} alt="arrow" className="my-[8px]" />

            {/* Step 4 */}
            <div className="relative mb-[16px]">
              <h1
                className={`${isDarkTheme ? "bg-[#18212E] text-[#C6D2E1]" : "bg-[#E2E8F0] text-[#1E293B]"} p-[20px] flex justify-center items-center rounded-[4px] w-[157px] h-[67px] text-[10px] font-[700] leading-[15px] tracking-[0.5px] uppercase text-center`}
              >
                Finalized
              </h1>
              <p
                className={`${isDarkTheme ? "bg-[#0D0D0D] border border-[#18212E] text-[#C6D2E1]" : "bg-white border border-[#E2E8F0] text-[#1E293B]"} absolute bottom-[-12px] left-1/2 -translate-x-1/2 flex justify-center items-center rounded-[4px] w-[64px] h-[24px] text-[10px] font-[700] leading-[15px] tracking-[0.5px] uppercase`}
              >
                {Number(transactionLifeCycleData?.finalized).toFixed(1) || 0}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionLiveCycleFlow;
