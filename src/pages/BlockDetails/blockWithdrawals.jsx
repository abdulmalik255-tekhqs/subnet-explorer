import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlockTabs from "../../components/BlockTabs/BlockTabs";
import ASSETS from "../../assets";

const BlockWithdrawals = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <div className="flex-grow bg-blocks px-10 pt-5 pb-5 md:pb-[174px]">
      <BlockTabs
        activeTab={"withdrawals"}
        onChange={(val) => {
          if (val === "overview") {
            navigate(`/block/${id}`);
            return;
          }
          if (val === "transactions") {
            navigate(`/block/${id}/transactions`, {
              state: { id },
            });
            return;
          }
        }}
      />
      <div className="bg-white  border border-bryt-grey-200 rounded-[12px] shadow-txBox mt-3">
        <div className="w-full overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-bryt-primary-main h-[38px] [&_td]:px-4">
                <td className="text-[12.5px] font-bold text-white">Index</td>
                <td className="text-[12.5px] font-bold text-white">
                  Validator Index
                </td>
                <td className="text-[12.5px] font-bold text-white">
                  Recipient
                </td>
                <td className="text-[12.5px] font-bold text-white">Value</td>
                <td className="text-[12.5px] font-bold text-white">Age</td>
              </tr>
            </thead>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <div className="flex items-center gap-1 mt-[10px]">
          <p className="text-[11.6px]">
            [ Download:{" "}
            <span className="font-semibold text-bryt-primary-main ">
              CSV Export
            </span>{" "}
          </p>
          <img src={ASSETS.download} alt="" />
          <p className="text-[11.6px]"> ]</p>
        </div>
      </div>
      <div className="flex items-start gap-[14.5px] mt-[14px]">
        <img src={ASSETS.bulb} alt="" />
        <p className="text-[12.5px] text-bryt-grey-700">
          Blocks are batches of transactions linked via cryptographic hashes.
          Any tampering of a block would invalidate all following blocks as all
          subsequent hashes would change. Learn more about this page in our{" "}
          <span className="text-bryt-primary-main">Knowledge Base</span>
        </p>
      </div>
    </div>
  );
};
export default BlockWithdrawals;
