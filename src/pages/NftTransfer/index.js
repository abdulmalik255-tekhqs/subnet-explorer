import React, { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";

import ASSETS from "../../assets";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import Pagination from "../../components/Pagination/Pagination";
import RowsPerPageDropdown from "../../components/Pagination/PageSelector";
import { ITEMS_PER_PAGE } from "../../app.config";
import { downloadAsCSV, shortenString } from "../../utils";
import { Link, useNavigate } from "react-router-dom";
import ClipBoardComponet from "../../components/Pagination/ClipBoard";
import { MdArrowRightAlt } from "react-icons/md";

dayjs.extend(utc);
dayjs.extend(relativeTime);

const NftTransfer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { AddressPages, tokenHeight, nftTransfers } = useSelector(
    (state) => state.tokens
  );

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(ITEMS_PER_PAGE);

  const handleRowsChange = (rows) => {
    setLimit(rows);
  };
  useEffect(() => {
    const lastID = nftTransfers?.[nftTransfers.length - 1]?.number;
    dispatch.tokens.getNFTTransfersWithPagination({ page, limit, lastID });

    // eslint-disable-next-line
  }, [page, limit]);

  return (
    <>
      <div className="pt-8 px-20">
        <p className="inline-flex text-[16px] w-full text-bryt-primary-main font-semibold gap-3 border-b border-b-bryt-primary-main pb-4">
          NFT Transfers
        </p>
      </div>
      <div className="px-20 py-8">
        {/* table */}
        <div className="bg-white  border border-bryt-grey-200 rounded-[12px] shadow-txBox mt-3">
          <div className="flex items-center justify-between py-5 px-[17px]">
            <div className="flex items-center gap-2">
              <img src={ASSETS.arrowDownList} alt="" />
              <p className="text-[14.5px]">
                Latest {nftTransfers?.length || 0} from a total of{" "}
                <span className="text-bryt-primary-main">
                  {tokenHeight || 0}
                </span>{" "}
                NFT Transfers
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div
                onClick={() =>
                  downloadAsCSV(nftTransfers, `nft_page_${page}.csv`)
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
                    Txn Hash
                  </td>
                  <td className="text-[11.5px] font-bold text-white">Block</td>
                  <td className="text-[11.5px] font-bold text-white">From</td>
                  <td className="text-[11.5px] font-bold text-white"></td>
                  <td className="text-[11.5px] font-bold text-white">To</td>
                  <td className="text-[11.5px] font-bold text-white">Type</td>
                  <td className="text-[11.5px] font-bold text-white">Token</td>
                  <td className="text-[11.5px] font-bold text-white">Age</td>
                </tr>
              </thead>
              <tbody>
                {nftTransfers?.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-400 py-6">
                      No nft transfers
                    </td>
                  </tr>
                )}
                {nftTransfers?.map((nft) => (
                  <tr
                    key={nft?.block_number}
                    className="h-12 [&_td]:px-4 [&_td]:border-b [&_td]:border-b-bryt-grey-200
                [&:last-of-type_td]:border-b-0 cursor-pointer"
                  >
                    <td className="text-[14.5px] text-bryt-primary-main">
                      <div className="flex gap-3">
                        <Link to={`/tx/${nft?.transaction_hash}`}>
                          <p className=" text-[12.5px] text-bryt-primary-main overflow-hidden text-ellipsis hover:underline hover:text-blue-600">
                            {shortenString(nft?.transaction_hash)}
                          </p>
                        </Link>
                        <ClipBoardComponet
                          val={nft?.transaction_hash}
                          message={"Transaction hash copied!"}
                        />
                      </div>
                    </td>
                    <td className="text-[12.5px] text-bryt-primary-main">
                      <Link to={`/block/${nft?.block_number}`}>
                        {nft?.block_number}
                      </Link>
                    </td>
                    <td className="text-[12.5px] text-bryt-primary-main">
                      <div className="flex gap-3">
                        <Link to={`/address/${nft?.from}`}>
                          <p
                            className="text-[12.5px] px-2 rounded-md flex justify-start items-start w-[20ch]
                   border-2 border-transparent 
                   hover:bg-bryt-grey-200
                   hover:border-bryt-primary-main 
                   hover:border-dotted"
                          >
                            {shortenString(nft.from) ||
                              "0x0000000000000000000000000000000000000000"}
                          </p>
                        </Link>
                        <ClipBoardComponet
                          val={nft?.from}
                          message={"Wallet address copied!"}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center h-8 items-center bg-bryt-grey-100 p-1 rounded-full">
                        <MdArrowRightAlt className="text-bryt-primary-main" />
                      </div>
                    </td>
                    <td className="text-[12.5px] text-bryt-primary-main">
                      <div className="flex gap-3">
                        <Link to={`/address/${nft?.to}`}>
                          <p
                            className="text-[12.5px] px-2 rounded-md flex justify-start items-start w-[20ch]
                   border-2 border-transparent 
                   hover:bg-bryt-grey-200
                   hover:border-bryt-primary-main 
                   hover:border-dotted"
                          >
                            {shortenString(nft.to) ||
                              "0x0000000000000000000000000000000000000000"}
                          </p>
                        </Link>
                        <ClipBoardComponet
                          val={nft?.to}
                          message={"Wallet address copied!"}
                        />
                      </div>
                    </td>

                    <td className="text-[12.5px] text-bryt-primary-main capitalize">
                      <div className="h-6 w-[120px] rounded-md border border-bryt-grey-200 grid place-items-center bg-bryt-grey-100">
                        <p className="text-[11px]">{nft?.token_type}</p>
                      </div>
                    </td>
                    <td className="text-[12.5px] text-bryt-primary-main capitalize cursor-pointer">
                      <div
                        onClick={() =>
                          navigate(
                            `/nft/${nft?.token_address}/${nft?.token_id}`
                          )
                        }
                      >
                        {shortenString(nft?.token_address)}
                      </div>
                    </td>
                    <td className="text-[12.5px] text-bryt-primary-main ">
                      {dayjs(Number(nft?.timestamp)).fromNow()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {nftTransfers && nftTransfers.length > 0 && AddressPages > 0 && (
          <div className="flex items-center justify-between py-5 px-[17px]">
            <RowsPerPageDropdown onChange={handleRowsChange} />
            <Pagination pages={AddressPages} page={page} setPage={setPage} />
          </div>
        )}
        {/* <div className="flex justify-end">
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
        </div> */}
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

export default NftTransfer;
