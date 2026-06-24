import React, { useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";

import ASSETS from "../../assets";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import { useDispatch, useSelector } from "react-redux";
import { Clock } from "@phosphor-icons/react";

dayjs.extend(utc);
dayjs.extend(relativeTime);

const BlockOverviewDetail = () => {
  const disptach = useDispatch();
  const navigate = useNavigate();
  const block = useSelector((state) => state.blocks.block);

  const blockNumber = useParams().id;
  const handleFetchBlock = async () => {
    try {
      disptach.blocks.getSingleBlock(blockNumber);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleViewTransactions = () => {
    navigate(`/block/${blockNumber}/transactions`, {
      state: block?.transactions,
    });
  };

  useEffect(() => {
    handleFetchBlock();
    // eslint-disable-next-line
  }, [blockNumber]);
  const formattedTime = dayjs.utc(Number(block?.timestamp)); // convert from string to number

  const displayTime = `${formattedTime.fromNow()} (${formattedTime.format(
    "MMM-DD-YYYY hh:mm:ss A [UTC]"
  )})`;
  return (
    <>
      <div className="bg-white px-[9px] py-5 border border-bryt-grey-200 rounded-[12px] shadow-txBox">
        <div className="flex flex-col gap-[15px] px-2">
          <div className="w-full grid grid-cols-1 md:grid-cols-12">
            <div className="col-span-3 flex items-center gap-1">
              <img src={ASSETS.infoGrey} className="w-[14.5px]" alt="" />
              <p className="text-[14.5px] text-bryt-grey-700"> Block Height:</p>
            </div>
            <div className="col-span-9">
              <div className="flex items-center gap-1">
                <p className="text-[14.5px]">{blockNumber}</p>
                {/* <div className='w-6 h-6 bg-bryt-grey-200 rounded-[6px] grid place-items-center cursor-pointer'>
                  <img src={ASSETS.chevronLeft} alt='' />
                </div>
                <div className='w-6 h-6 bg-bryt-grey-200 rounded-[6px] grid place-items-center cursor-pointer'>
                  <img src={ASSETS.chevronRight} alt='' />
                </div> */}
              </div>
            </div>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-12">
            <div className="col-span-3 flex items-center gap-1">
              <img src={ASSETS.infoGrey} className="w-[14.5px]" alt="" />
              <p className="text-[14.5px] text-bryt-grey-700"> Status:</p>
            </div>
            <div className="col-span-9 flex">
              <div className="flex items-center gap-1 border border-bryt-grey-200 bg-bryt-grey-100 px-2 py-[5px] rounded-[6px]">
                <img src={ASSETS.check} alt="" />
                <p className="text-[11px] font-semibold">
                  {" "}
                  {block?.block_status}
                </p>
              </div>
            </div>
          </div>
          {/* <div className="w-full grid grid-cols-12">
            <div className="col-span-3 flex items-center gap-1">
              <img src={ASSETS.infoGrey} className="w-[14.5px]" alt="" />
              <p className="text-[14.5px] text-bryt-grey-700"> Timestamp:</p>
            </div>
            <div className="col-span-9">
              <div className="flex items-center gap-1">
                <img src={ASSETS.clock} alt="" />
                <p className="text-[14.5px]">{renderTime()}</p>
              </div>
            </div>
          </div> */}
          {/* <div className="w-full grid grid-cols-12">
            <div className="col-span-3 flex items-center gap-1">
              <img src={ASSETS.infoGrey} className="w-[14.5px]" alt="" />
              <p className="text-[14.5px] text-bryt-grey-700"> Proposed On:</p>
            </div>
            <div className="col-span-9">
              <p className="text-[14.5px]">Block proposed on slot</p>
            </div>
          </div> */}
          <div className="w-full grid grid-cols-1 md:grid-cols-12">
            <div className="col-span-3 flex items-center gap-1">
              <img src={ASSETS.infoGrey} className="w-[14.5px]" alt="" />
              <p className="text-[14.5px] text-bryt-grey-700"> Transactions:</p>
            </div>
            <div className="col-span-9">
              {block?.transactions?.length > 0 ? (
                <p
                  className="text-[14.5px] cursor-pointer"
                  onClick={handleViewTransactions}
                >
                  {block?.transactions?.length || 0} transactions
                </p>
              ) : (
                <p className="text-[14.5px]">
                  {block?.transactions?.length || 0} transactions
                </p>
              )}
            </div>
          </div>
          {/* <div className="border-t border-t-bryt-grey-200 my-[5px]"></div>
          <div className="w-full grid grid-cols-12 px-2">
            <div className="col-span-3 flex items-center gap-1">
              <img src={ASSETS.infoGrey} className="w-[14.5px]" alt="" />
              <p className="text-[14.5px] text-bryt-grey-700"> Size:</p>
            </div>
            <div className="col-span-9">
              <p className="text-[14.5px]">106,848 bytes</p>
            </div>
          </div> */}
          <div className="w-full grid grid-cols-1 md:grid-cols-12">
            <div className="col-span-3 flex items-center gap-1">
              <img src={ASSETS.infoGrey} className="w-[14.5px]" alt="" />
              <p className="text-[14.5px] text-bryt-grey-700"> Timestamp:</p>
            </div>
            <div className="col-span-9 flex gap-2">
              <Clock size={20} />
              <p className="text-[14.5px]"> {displayTime}</p>
            </div>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-12">
            <div className="col-span-3 flex items-center gap-1">
              <img src={ASSETS.infoGrey} className="w-[14.5px]" alt="" />
              <p className="text-[14.5px] text-bryt-grey-700"> Block Reward:</p>
            </div>
            <div className="col-span-9">
              <p className="text-[14.5px]">
                {block?.block_reward ? block?.block_reward : "0x00 RYT"}
              </p>
            </div>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-12">
            <div className="col-span-3 flex items-center gap-1">
              <img src={ASSETS.infoGrey} className="w-[14.5px]" alt="" />
              <p className="text-[14.5px] text-bryt-grey-700">Size:</p>
            </div>
            <div className="col-span-9">
              <p className="text-[14.5px]">{block?.size} bytes</p>
            </div>
          </div>
          <div className="border-t border-t-bryt-grey-200 my-[5px]"></div>
          <div className="w-full grid grid-cols-1 md:grid-cols-12">
            <div className="col-span-3 flex items-center gap-1">
              <img src={ASSETS.infoGrey} className="w-[14.5px]" alt="" />
              <p className="text-[14.5px] text-bryt-grey-700"> Validator:</p>
            </div>
            <div className="col-span-9">
              <p className="text-[14.5px] break-all">{block?.miner}</p>
            </div>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-12">
            <div className="col-span-3 flex items-center gap-1">
              <img src={ASSETS.infoGrey} className="w-[14.5px]" alt="" />
              <p className="text-[14.5px] text-bryt-grey-700"> Hash:</p>
            </div>
            <div className="col-span-9">
              <p className="text-[14.5px] break-all">{block?.block_hash}</p>
            </div>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-12">
            <div className="col-span-3 flex items-center gap-1">
              <img src={ASSETS.infoGrey} className="w-[14.5px]" alt="" />
              <p className="text-[14.5px] text-bryt-grey-700">
                {" "}
                Previous Hash:
              </p>
            </div>
            <div className="col-span-9">
              <p className="text-[14.5px] break-all">{block?.previous_hash}</p>
            </div>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-12">
            <div className="col-span-3 flex items-center gap-1">
              <img src={ASSETS.infoGrey} className="w-[14.5px]" alt="" />
              <p className="text-[14.5px] text-bryt-grey-700"> StateRoot:</p>
            </div>
            <div className="col-span-9">
              <p className="text-[14.5px] break-all">{block?.state_root}</p>
            </div>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-12">
            <div className="col-span-3 flex items-center gap-1">
              <img src={ASSETS.infoGrey} className="w-[14.5px]" alt="" />
              <p className="text-[14.5px] text-bryt-grey-700">
                {" "}
                TransactionRoot:
              </p>
            </div>
            <div className="col-span-9">
              <p className="text-[14.5px] break-all">
                {block?.transaction_root}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-start gap-[14.5px] mt-[14px]">
        <img src={ASSETS.bulb} alt="" />
        <p className="text-[11.5px] text-bryt-grey-700">
          Blocks are batches of transactions linked via cryptographic hashes.
          Any tampering of a block would invalidate all following blocks as all
          subsequent hashes would change. Learn more about this page in our{" "}
          <span className="text-bryt-primary-main">Knowledge Base</span>
        </p>
      </div>
    </>
  );
};
export default BlockOverviewDetail;
