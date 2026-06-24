import React from "react";
import classNames from "classnames";

import { useParams } from "react-router-dom";
import ASSETS from "../../assets";

const BlockTabs = ({ activeTab = "overview", onChange = () => {} }) => {
  const blockNumber = useParams().id;
  return (
    <>
      <div className="flex items-center gap-[6px]">
        <p className="text-[19px] font-semibold">Block</p>
        <p className="text-[14.5px] text-bryt-grey-700">#{blockNumber}</p>
      </div>
      <div className="flex items-center gap-[10px] mt-1">
        <div className="flex items-center gap-[3px] rounded-3xl border border-bryt-grey-300 py-[4.5px] px-[6px]">
          <p className="text-[11px]">#</p>
          <p className="text-[11px] font-semibold">POM Block</p>
          <img src={ASSETS.info} alt="" />
        </div>
      </div>
      <div className="border-t border-t-bryt-grey-200 mt-[21px]"></div>
      <p className="text-[14.5px] text-bryt-primary-main mt-[14px] mb-9">
        Use <span className="font-bold">RYT SDK</span> for network
        communications
      </p>
      <div className=" mb-3 inline-flex flex-wrap items-center gap-2 p-3 bg-bryt-grey-200 rounded-md">
        <button
          className={classNames(
            "py-1 px-3 rounded-lg text-bryt-primary-main text-[12.6px] font-semibold bg-bryt-grey-200",
            activeTab === "overview" && "bg-bryt-primary-main text-white"
          )}
          onClick={() => onChange("overview")}
        >
          Overview
        </button>

        <button
          className={classNames(
            "py-1 px-3 rounded-lg text-bryt-primary-main text-[12.6px] font-semibold bg-bryt-grey-200",
            activeTab === "transactions" && "bg-bryt-primary-main text-white"
          )}
          onClick={() => onChange("transactions")}
        >
          Transactions
        </button>
        {/* <button
          className={classNames(
            "py-[5px] px-[9px] bg-bryt-grey-200 rounded-lg text-bryt-primary-main",
            activeTab === "withdrawals" && "text-white bg-bryt-primary-main"
          )}
          onClick={() => onChange("withdrawals")}
        >
          <p className="text-inherit text-[12.6px] font-semibold">
            Withdrawals
          </p>
        </button> */}
      </div>
    </>
  );
};

export default BlockTabs;
