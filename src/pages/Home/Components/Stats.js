import React from "react";

import { useSelector } from "react-redux";

import ASSETS from "../../../assets";

const Stats = () => {
  const { blocks } = useSelector((state) => state.blocks);
  return (
    <div className="px-10 translate-y-[-28px]">
      <div className="bg-white w-full rounded-[12px] grid grid-cols-12 border  border-bryt-grey-200 py-5 shadow-stats">
        <div className="col-span-4  px-[18px]">
          <div className="flex items-start gap-[15px]">
            <img src={ASSETS.b} alt="" />
            <div>
              <p className="text-xs text-bryt-grey-700 uppercase">RYT Price</p>
              <p className="text-[15px] text-bryt-primary-main mt-[1px]">
                $3,755.89{" "}
                <span className="text-bryt-grey-700">@ 0.055878 RYT</span>{" "}
                <span className="text-bryt-red"> (-1.43%)</span>
              </p>
            </div>
          </div>
          <div className="h-[1px] bg-bryt-grey-200 w-full my-5"></div>
          <div className="flex items-start gap-[15px]">
            <img src={ASSETS.globe} alt="" />
            <div>
              <p className="text-xs text-bryt-grey-700 uppercase">Market Cap</p>
              <p className="text-[15px] text-bryt-primary-main mt-[1px]">
                2,388.92 M
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-4  px-[18px] border-l border-l-bryt-grey-200 border-r border-r-bryt-grey-200">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-[15px]">
              <img src={ASSETS.txs} alt="" />
              <div>
                <p className="text-xs text-bryt-grey-700 uppercase">
                  Transactions
                </p>
                <p className="text-[15px] text-bryt-primary-main mt-[1px]">
                  2,388.92 M{" "}
                  <span className="text-bryt-grey-700"> (14.3 TPS)</span>
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-bryt-grey-700 uppercase text-right">
                Med Gas Price
              </p>
              <p className="text-[15px] text-bryt-primary-main mt-[1px] text-right">
                16 Gwei <span className="text-bryt-grey-700"> ($1.26)</span>
              </p>
            </div>
          </div>
          <div className="h-[1px] bg-bryt-grey-200 w-full my-5"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-[15px]">
              <img src={ASSETS.meter} alt="" />
              <div>
                <p className="text-xs text-bryt-grey-700 uppercase">
                  Last Finalized Block
                </p>
                <p className="text-[15px] text-bryt-primary-main mt-[1px]">
                  {blocks[0]?.blockNumber}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-bryt-grey-700 uppercase text-right">
                Last Safe Block
              </p>
              <p className="text-[15px] text-bryt-primary-main mt-[1px] text-right">
                {blocks[0]?.blockNumber}
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-4 px-[18px]">
          <div className="">
            <p className="text-xs text-bryt-grey-700 uppercase">
              Transaction History in 14 days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
