import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ClipBoardComponet from "../../../components/Pagination/ClipBoard";
import { shortenString } from "../../../utils";
import useTheme from "../../../hooks/useTheme";

dayjs.extend(relativeTime);

const BlocksTable = () => {
  const { isDarkTheme } = useTheme();
  const disptach = useDispatch();
  const [list, setList] = useState([]);
  const { blocks } = useSelector((state) => state.blocks);
  const handleFetchBlocks = () => {
    disptach.blocks.handleGetAllBlocks();
  };
  useEffect(() => {
    handleFetchBlocks();
    const interval = setInterval(() => {
      handleFetchBlocks();
    }, 10000);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (blocks?.length > 7) {
      setList(blocks?.slice(0, 7));
    } else {
      setList(blocks);
    }
  }, [blocks, disptach]);
  return (
    <div
      className={`border ${isDarkTheme ? "border-[#18212E]" : "border-[#E2E8F0]"} rounded-[8px] overflow-hidden h-full`}
    >
      {/* Header */}
      <div
        className={`flex justify-between items-center px-[16px] py-[14px]  ${isDarkTheme ? "bg-[#0D0D0D] border-b border-[#18212E]" : "bg-[#FFFFFF] border-b border-[#E2E8F0]"}`}
      >
        <h1
          className={`${isDarkTheme ? "text-[#C4CFE1]" : "text-[#1E293B]"} text-[14px] font-[700] leading-[20px] uppercase tracking-[0.7px]`}
        >
          Latest Blocks
        </h1>
        {/* <span
          className={`${isDarkTheme ? "text-[#3B7EE8]" : "text-[#3B7EE8]"} text-[12px] font-[700] leading-[16px] cursor-pointer hover:underline`}
        >
          View All Blocks
        </span> */}
      </div>

      {/* Table */}
      <div className="w-full overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr
              className={`${isDarkTheme ? "bg-[#121212] border-b border-[#18212E]" : "bg-[#F8FAFC] border-b border-[#E2E8F0]"}`}
            >
              <th className="text-left text-[12px] font-[600] leading-[16px] text-[#64748B] uppercase tracking-[0.6px] px-[16px] py-[8px]">
                Block
              </th>
              <th className="text-left text-[12px] font-[600] leading-[16px] text-[#64748B] uppercase tracking-[0.6px] px-[16px] py-[8px]">
                Validator
              </th>
              <th className="text-left text-[12px] font-[600] leading-[16px] text-[#64748B] uppercase tracking-[0.6px] px-[16px] py-[8px]">
                Txns
              </th>
              <th className="text-left text-[12px] font-[600] leading-[16px] text-[#64748B] uppercase tracking-[0.6px] px-[16px] py-[8px]">
                Reward
              </th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-b-0">
            {list?.length > 0 ? (
              list?.map((block, index) => (
                <tr
                  key={block?.block_number || index}
                  className={` ${isDarkTheme ? "border-b border-[#18212E] bg-[#0D0D0D] hover:bg-[#0F1520] " : "border-b border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] "}`}
                >
                  {/* Block number + age */}
                  <td className="px-[16px] py-[11px] flex flex-col gap-[4px]">
                    <span
                      className={`text-[14px] font-[700] ${isDarkTheme ? "text-[#528CEB]" : "text-[#3B7EE8]"} leading-[18px]`}
                    >
                      {block?.block_number}
                    </span>
                    <span className="text-[10px] text-[#64748B] leading-[15px] font-[400]">
                      {dayjs(Number(block?.timestamp)).fromNow()}
                    </span>
                  </td>

                  {/* Validator */}
                  <td className="px-[16px] py-[11px]">
                    <div className="flex items-center gap-[6px]">
                      <span
                        className={`text-[12px] font-[400] leading-[16px] ${isDarkTheme ? "text-[#C4CFE1]" : "text-[#1E293B]"} cursor-pointer hover:underline`}
                      >
                        {shortenString(block?.block_hash)}
                      </span>
                      <ClipBoardComponet
                        val={block?.block_hash}
                        message="Address copied!"
                      />
                    </div>
                  </td>

                  {/* Txns */}
                  <td className="px-[16px] py-[11px]">
                    <span
                      className={`text-[12px] font-[400] leading-[16px] ${isDarkTheme ? "text-[#C4CFE1]" : "text-[#1E293B]"} cursor-pointer hover:underline`}
                    >
                      {block?.transactions?.length || 0}
                    </span>
                  </td>

                  {/* Reward */}
                  <td className="px-[16px] py-[11px]">
                    <span
                      className={`text-[12px] font-[700] ${isDarkTheme ? "text-[#00B277]" : "text-[#009966]"} leading-[16px]`}
                    >
                      {block?.block_reward ? block?.block_reward : "0.00"} RYT
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-8 text-[12px] text-[#64748B]"
                >
                  No blocks available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlocksTable;
