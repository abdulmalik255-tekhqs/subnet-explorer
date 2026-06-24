import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import { useParams, useNavigate } from "react-router-dom";
import BlockTabs from "../../components/BlockTabs/BlockTabs";
import ASSETS from "../../assets";
import { useDispatch, useSelector } from "react-redux";
import { downloadAsCSV, shortenString } from "../../utils";
import ClipBoardComponet from "../../components/Pagination/ClipBoard";

dayjs.extend(utc);
dayjs.extend(relativeTime);
const BlockTransaction = () => {
  const { id } = useParams();
  const disptach = useDispatch();
  const navigate = useNavigate();
  const { blocks } = useSelector((state) => state.blocks);
  const handleFetchBlock = async () => {
    try {
      disptach.blocks.handleGetAllBlocksTransactions(id);
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    handleFetchBlock();
    // eslint-disable-next-line
  }, [id]);
  return (
    <div className="flex-grow bg-blocks px-20 py-8 pt-5 pb-5 md:pb-[174px]">
      <BlockTabs
        activeTab={"transactions"}
        onChange={(val) => {
          if (val === "overview") {
            navigate(`/block/${id}`);
            return;
          }
          // if (val === "withdrawals") {
          //   navigate(`/block/${id}/withdrawals`);
          //   return;
          // }
        }}
      />

      <div className="bg-white  border border-bryt-grey-200 rounded-[12px] shadow-txBox mt-3">
        <div className="w-full overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-bryt-primary-main h-[38px] [&_td]:px-4">
                <td className="text-[11.5px] font-bold text-white">Txn Hash</td>
                <td className="text-[11.5px] font-bold text-white">Type</td>
                <td className="text-[11.5px] font-bold text-white">Method</td>
                <td className="text-[11.5px] font-bold text-white">Block</td>
                <td className="text-[11.5px] font-bold text-white">From</td>
                <td className="text-[11.5px] font-bold text-white">To</td>
                <td className="text-[11.5px] font-bold text-white">Amount</td>

                <td className="text-[11.5px] font-bold text-white">Age</td>
              </tr>
            </thead>
            <tbody>
              {blocks?.map((block) => (
                <tr
                  key={block?.block}
                  className="h-12 [&_td]:px-4 [&_td]:border-b [&_td]:border-b-bryt-grey-200
                [&:last-of-type_td]:border-b-0 cursor-pointer"
                >
                  <td className="text-[12.5px] text-bryt-primary-main flex m-2 gap-2 overflow-hidden text-ellipsis hover:underline hover:text-blue-600">
                    <Link to={`/tx/${block?.hash}`}>
                      {shortenString(block?.hash) ||
                        "0x0000000000000000000000000000000000000000"}
                    </Link>

                    <ClipBoardComponet
                      val={block?.hash}
                      message={"Transaction Hash copied!"}
                    />
                  </td>
                  <td className="text-[12.5px] text-bryt-primary-main">
                    <div className="h-6 w-auto rounded-md border border-bryt-grey-200 grid place-items-center bg-bryt-grey-100">
                      <p className="text-[11px]">
                        {block?.transaction_type ?? "N/A"}
                      </p>
                    </div>
                  </td>
                  <td className="text-[12.5px] text-bryt-primary-main">
                    <div className="h-6 w-auto rounded-md border border-bryt-grey-200 grid place-items-center bg-bryt-grey-100">
                      <p className="text-[11px]">
                        {block?.function_name ?? "N/A"}
                      </p>
                    </div>
                  </td>
                  <td className="text-[12.5px] text-bryt-primary-main hover:underline hover:text-blue-600">
                    <Link to={`/block/${block?.block}`}>{block?.block}</Link>
                  </td>
                  <td className="text-[12.5px] text-bryt-primary-main">
                    <div className="flex items-center gap-2">
                      <p
                        className="text-[12.5px] px-2 rounded-md flex justify-center items-center
                   border-2 border-transparent 
                   hover:bg-bryt-grey-200
                   hover:border-bryt-primary-main 
                   hover:border-dotted"
                      >
                        <Link to={`/address/${block?.from}`}>
                          {shortenString(block?.from)}
                        </Link>
                      </p>
                      <ClipBoardComponet
                        val={block?.from}
                        message={"Wallet address copied!"}
                      />
                    </div>
                  </td>
                  <td className="text-[12.5px] text-bryt-primary-main">
                    <div className="flex items-center gap-2">
                      <p
                        className="text-[12.5px] px-2 rounded-md flex justify-center items-center
                   border-2 border-transparent 
                   hover:bg-bryt-grey-200
                   hover:border-bryt-primary-main 
                   hover:border-dotted"
                      >
                        <Link to={`/address/${block?.to}`}>
                          {shortenString(block?.to)}
                        </Link>
                      </p>
                      <ClipBoardComponet
                        val={block?.to}
                        message={"Wallet address copied!"}
                      />
                    </div>
                  </td>
                  <td className="text-[12.5px] text-bryt-primary-main">
                    {block?.value} RYT
                  </td>
                  <td className="text-[12.5px] text-bryt-primary-main">
                    {dayjs(Number(block?.timestamp)).fromNow()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <div className="flex items-center gap-2">
          <div
            onClick={() => downloadAsCSV(blocks, `blocks_transactions.csv`)}
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
      <div className="flex items-start gap-[14.5px] mt-[14px]">
        <img src={ASSETS.bulb} alt="" />
        <p className="text-[11.5px] text-bryt-grey-700">
          Blocks are batches of transactions linked via cryptographic hashes.
          Any tampering of a block would invalidate all following blocks as all
          subsequent hashes would change. Learn more about this page in our{" "}
          <span className="text-bryt-primary-main">Knowledge Base</span>
        </p>
      </div>
    </div>
  );
};

export default BlockTransaction;
