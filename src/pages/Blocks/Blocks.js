import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import Pagination from "../../components/Pagination/Pagination";
import RowsPerPageDropdown from "../../components/Pagination/PageSelector";
import ASSETS from "../../assets";
import { ITEMS_PER_PAGE } from "../../app.config";
import { downloadAsCSV, shortenString } from "../../utils";
import ClipBoardComponet from "../../components/Pagination/ClipBoard";

dayjs.extend(utc);
dayjs.extend(relativeTime);

const Blocks = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pages, blockHeight, blocksPaginatedData } = useSelector(
    (state) => state.blocks,
  );
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(ITEMS_PER_PAGE);

  const handleClick = (block) => {
    navigate(`/block/${block?.block_number}`);
  };
  const handleRowsChange = (rows) => {
    setLimit(rows);
  };
  useEffect(() => {
    const lastID = blocksPaginatedData?.[blocksPaginatedData.length - 1]?.id;
    dispatch.blocks.getBlockWithPagination({ page, limit, lastID });
    dispatch.blocks.handleGetLatestBlockId();
    // eslint-disable-next-line
  }, [page, limit]);

  return (
    <>
      <div className="pt-8 px-20">
        <p className="inline-flex text-[16px] w-full text-bryt-primary-main font-semibold gap-3 border-b border-b-bryt-primary-main pb-4">
          Blocks
        </p>
      </div>
      <div className="px-20 py-8">
        {/* table section */}
        <div className="bg-white  border border-bryt-grey-200 rounded-[12px] shadow-txBox mt-3">
          <div className="flex items-center justify-between py-5 px-[17px]">
            <div className="flex items-center gap-2">
              <img src={ASSETS.arrowDownList} alt="" />
              <p className="text-[14.5px]">
                Latest {blocksPaginatedData?.length || 0} from a total of{" "}
                <span className="text-bryt-primary-main">{blockHeight}</span>{" "}
                blocks
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div
                onClick={() =>
                  downloadAsCSV(blocksPaginatedData, `blocks_page_${page}.csv`)
                }
                className="flex items-center gap-[6px] border border-bryt-grey-200 h-[29px] px-[10px] rounded-md cursor-pointer"
              >
                <img src={ASSETS.download} alt="" />
                <p className="text-[12.5px]"> Download Page Data</p>
              </div>
              {/* <div className="flex items-center gap-[6px] border border-bryt-grey-200 h-[29px] px-[10px] rounded-md cursor-not-allowed">
              <img src={ASSETS.cone} alt="" />
              <img src={ASSETS.arrowDown} alt="" />
            </div> */}
            </div>
          </div>
          <div className="w-full overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-bryt-primary-main h-[38px] [&_td]:px-4">
                  <td className="text-[11.5px] font-bold text-white">
                    Block Number
                  </td>
                  <td className="text-[11.5px] font-bold text-white">
                    Transactions count
                  </td>
                  <td className="text-[11.5px] font-bold text-white">
                    Block Hash
                  </td>
                  <td className="text-[11.5px] font-bold text-white">
                    Validator
                  </td>
                  <td className="text-[11.5px] font-bold text-white">
                    Block Reward
                  </td>
                  <td className="text-[11.5px] font-bold text-white">Age</td>
                </tr>
              </thead>
              <tbody>
                {blocksPaginatedData?.map((block) => (
                  <tr
                    key={block?.block_number}
                    className="h-12 [&_td]:px-4 [&_td]:border-b [&_td]:border-b-bryt-grey-200
                [&:last-of-type_td]:border-b-0 cursor-pointer"
                  >
                    <td className="text-[12.5px] text-bryt-primary-main overflow-hidden text-ellipsis hover:underline hover:text-blue-600">
                      <div onClick={() => handleClick(block)}>
                        {block?.block_number}
                      </div>
                    </td>
                    <td className="text-[12.5px] text-bryt-primary-main">
                      {block?.transactions?.length || 0} txns{" "}
                    </td>
                    <td className="text-[12.5px] text-bryt-primary-main">
                      <div className="flex items-center gap-2">
                        {/* <Link to={`/tx/${block?.block_hash}`}> */}
                        <p
                          className="text-[12.5px] px-2 rounded-md flex justify-center items-center
                   border-2 border-transparent 
                   hover:bg-bryt-grey-200
                   hover:border-bryt-primary-main 
                   hover:border-dotted"
                        >
                          {shortenString(block?.block_hash) ||
                            "0x0000000000000000000000000000000000000000"}
                        </p>
                        {/* </Link> */}

                        <ClipBoardComponet
                          val={block?.block_hash}
                          message={"Hash copied!"}
                        />
                      </div>
                    </td>
                    <td className="text-[12.5px] text-bryt-primary-main">
                      {shortenString(block?.miner) ||
                        "0x000000000000000000000000000000000000000"}
                    </td>
                    {/* <td className='text-[14.5px] text-bryt-primary-main capitalize'>
                    {dayjs.unix(block?.timestamp).fromNow()}
                    {' -- '} (
                    {dayjs.unix(block?.timestamp).format('DD MMM, YYYY h:mm A')}
                    )
                  </td> */}
                    <td className="text-[12.5px] text-bryt-primary-main capitalize">
                      {block?.block_reward ? block?.block_reward : "0x00"} RYT
                    </td>
                    <td className="text-[12.5px] text-bryt-primary-main ">
                      {dayjs(Number(block?.timestamp)).fromNow()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {blocksPaginatedData && blocksPaginatedData.length > 0 && pages > 0 && (
          <div className="flex items-center justify-between py-5 px-[17px]">
            <RowsPerPageDropdown onChange={handleRowsChange} />
            <Pagination pages={pages} page={page} setPage={setPage} />
          </div>
        )}

        <div className="flex items-start gap-[14.5px] mt-[14px]">
          <img src={ASSETS.bulb} alt="" />
          <p className="text-[11.5px] text-bryt-grey-700">
            Blocks are batches of transactions linked via cryptographic hashes.
            Any tampering of a block would invalidate all following blocks as
            all subsequent hashes would change. Learn more about this page in
            our <span className="text-bryt-primary-main">Knowledge Base</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Blocks;
