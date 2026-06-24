import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import ASSETS from "../../../assets";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link, useNavigate } from "react-router-dom";
import { shortenString } from "../../../utils";

dayjs.extend(utc);
dayjs.extend(relativeTime);

const Block = ({ data }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/block/${data?.block_number}`);
  };
  const timeAgo = dayjs(Number(data?.timestamp)).fromNow();

  return (
    <div
      className="py-[14px] px-4 flex items-center gap-10 cursor-pointer border-b border-b-bryt-grey-200 last-of-type:border-b-0"
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        <div className="h-12 w-12 rounded-lg grid place-items-center bg-bryt-grey-100">
          <img src={ASSETS.block} alt="" />
        </div>
        <div>
          <p className="text-[14.5px] text-bryt-primary-main w-[12ch] overflow-hidden text-ellipsis">
            {data?.block_number}
          </p>
          {/* <p className="text-[14.5px] text-bryt-grey-700">
            {dayjs.unix(data?.timestamp).fromNow()}
          </p> */}
        </div>
      </div>
      <div className="flex-grow flex items-center justify-between gap-2">
        <div>
          {/* <p className="text-[14.5px]">
            Fee Recipient{' '}
            <span className="text-bryt-primary-main">Titan Builder</span>
          </p> */}
          <p className="text-[12.5px]">
            Fee Recipient{" "}
            <span className="text-bryt-primary-main">
              {shortenString(data?.block_hash)}
            </span>
          </p>
          <p className="text-[14.5px]">
            <span className="text-bryt-primary-main">
              {data?.transactions?.length || 0} txns{" "}
            </span>
            <span className="text-[12.5px] text-bryt-grey-700"></span>
          </p>
        </div>
        <div>
          <div className="flex justify-end text-[11px] mb-2 text-bryt-primary-main">
            {timeAgo}
          </div>
          <div className="flex justify-center items-center w-auto p-[5px]  border border-bryt-grey-300 rounded-[6px]">
            <p className="text-[12px] font-[500] text-bryt-primary-main pt-[1px]">
              {data?.block_reward ? data?.block_reward : "0x00"} RYT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Blocks = () => {
  const disptach = useDispatch();
  const [list, setList] = useState([]);
  const { blocks } = useSelector((state) => state.blocks);

  const handleFetchBlocks = () => {
    disptach.blocks.handleGetAllBlocks();
    disptach.blocks.handleGetLatestBlockId();
    disptach.blocks.handleGetdashboardDetail();
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
    if (blocks.length > 7) {
      setList(blocks.slice(0, 7));
    } else {
      setList(blocks);
    }
  }, [blocks]);
  return (
    <div className="border border-bryt-grey-200 rounded-[16px] flex flex-col overflow-hidden shadow-md">
      <div className="bg-footer p-4 flex items-center justify-between">
        <p className="text-[12.5px] font-bold text-bryt-primary-main">
          Latest Blocks
        </p>
        <button className="flex items-center gap-1 px-2 py-[5px] bg-white border border-bryt-grey-200 rounded-[6px] cursor-not-allowed">
          <img src={ASSETS.sortBy} alt="" />
          <p className="text-xs text-bryt-primary-main">Sort by</p>
        </button>
      </div>
      <div>
        {list?.map((block) => (
          <Block key={block?.block_hash} data={block} />
        ))}
      </div>
      <div className="group flex items-center justify-center gap-[10px] p-6 border-t border-t-bryt-grey-200 cursor-pointer">
        <Link
          to="/blocks"
          onClick={() => disptach.blocks.setBlocksDataPagination([])}
          className="flex items-center gap-[10px]"
        >
          {/* Text */}
          <span className="relative text-xs font-semibold text-bryt-grey-700 uppercase transition-colors duration-300 group-hover:text-bryt-primary-main">
            View all blocks
            {/* underline */}
            <span className="absolute left-0 -bottom-[2px] h-[1.5px] w-0 bg-bryt-primary-main transition-all duration-300 group-hover:w-full" />
          </span>

          {/* Arrow */}
          <img
            src={ASSETS.arrowRight}
            alt=""
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </div>
  );
};

export default Blocks;
