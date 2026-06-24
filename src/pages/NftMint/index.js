import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import Pagination from "../../components/Pagination/Pagination";
import ASSETS from "../../assets";
import RowsPerPageDropdown from "../../components/Pagination/PageSelector";
import { ITEMS_PER_PAGE } from "../../app.config";
import { downloadAsCSV, shortenString } from "../../utils";
import ClipBoardComponet from "../../components/Pagination/ClipBoard";

dayjs.extend(utc);
dayjs.extend(relativeTime);

const NftMint = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { AddressPages, tokenHeight, nftMint } = useSelector(
    (state) => state.tokens
  );

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(ITEMS_PER_PAGE);
  const handleRowsChange = (rows) => {
    setLimit(rows);
  };
  useEffect(() => {
    const lastID = nftMint?.[nftMint?.length - 1]?.number;
    dispatch.tokens.getNFTMintWithPagination({ page, limit, lastID });

    // eslint-disable-next-line
  }, [page, limit]);

  return (
    <>
      <div className="pt-8 px-20">
        <p className="inline-flex text-[16px] w-full text-bryt-primary-main font-semibold gap-3 border-b border-b-bryt-primary-main pb-4">
          NFT Mints
        </p>
      </div>
      <div className="px-20 py-8">
        <div className="bg-white  border border-bryt-grey-200 rounded-[12px] shadow-txBox mt-3">
          <div className="flex items-center justify-between py-5 px-[17px]">
            <div className="flex items-center gap-2">
              <img src={ASSETS.arrowDownList} alt="" />
              <p className="text-[14.5px]">
                Latest {nftMint?.length || 0} from a total of{" "}
                <span className="text-bryt-primary-main">
                  {tokenHeight || 0}
                </span>{" "}
                NFT Mints
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div
                onClick={() =>
                  downloadAsCSV(nftMint, `nft_mint_page_${page}.csv`)
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
                    Transaction Hash
                  </td>
                  <td className="text-[11.5px] font-bold text-white">Block</td>
                  <td className="text-[11.5px] font-bold text-white">Type</td>
                  <td className="text-[11.5px] font-bold text-white">Token</td>

                  <td className="text-[11.5px] font-bold text-white">Age</td>
                </tr>
              </thead>
              <tbody>
                {nftMint?.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-400 py-6">
                      No mints transfers
                    </td>
                  </tr>
                )}
                {nftMint?.map((mint) => (
                  <tr
                    key={mint.block_number}
                    className="h-12 [&_td]:px-4 [&_td]:border-b [&_td]:border-b-bryt-grey-200
                [&:last-of-type_td]:border-b-0 cursor-pointer"
                  >
                    <td className="text-[12.5px] text-bryt-primary-main">
                      <div className="flex gap-3">
                        <Link to={`/tx/${mint?.transaction_hash}`}>
                          <p className="flex gap-3 text-[12.5px] text-bryt-primary-main  overflow-hidden text-ellipsis hover:underline hover:text-blue-600">
                            {shortenString(mint?.transaction_hash)}
                          </p>
                        </Link>
                        <ClipBoardComponet
                          val={mint?.transaction_hash}
                          message={"Transaction hash copied!"}
                        />
                      </div>
                    </td>
                    <td className="text-[12.5px] text-bryt-primary-main">
                      <Link to={`/block/${mint?.block_number}`}>
                        {mint?.block_number}
                      </Link>
                    </td>
                    <td className="text-[12.5px] text-bryt-primary-main">
                      <div className="h-6 w-[120px] rounded-md border border-bryt-grey-200 grid place-items-center bg-bryt-grey-100">
                        <p className="text-[11px]">{mint?.token_type}</p>
                      </div>
                    </td>

                    <td className="text-[12.5px] text-bryt-primary-main">
                      <div className="flex gap-3">
                        <p
                          onClick={() =>
                            navigate(
                              `/nft/${mint?.token_address}/${mint?.token_id}`
                            )
                          }
                          className="text-[12.5px] px-2 rounded-md flex justify-center items-center
                   border-2 border-transparent 
                   hover:bg-bryt-grey-200
                   hover:border-bryt-primary-main 
                   hover:border-dotted"
                        >
                          {mint?.token_address}
                        </p>
                        <ClipBoardComponet
                          val={mint?.token_address}
                          message={"Wallet address copied!"}
                        />
                      </div>
                    </td>
                    <td className="text-[12.5px] text-bryt-primary-main ">
                      {dayjs(Number(mint?.timestamp)).fromNow()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {nftMint && nftMint.length > 0 && AddressPages > 0 && (
          <div className="flex items-center justify-between py-5 px-[17px]">
            <RowsPerPageDropdown onChange={handleRowsChange} />
            <Pagination pages={AddressPages} page={page} setPage={setPage} />
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

export default NftMint;
