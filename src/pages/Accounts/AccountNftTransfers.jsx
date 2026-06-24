import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ASSETS from "../../assets";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import { ITEMS_PER_PAGE } from "../../app.config";
import { downloadAsCSV, handleCopy, shortenString } from "../../utils";
import RowsPerPageDropdown from "../../components/Pagination/PageSelector";
import Pagination from "../../components/Pagination/Pagination";

dayjs.extend(utc);
dayjs.extend(relativeTime);
const AccountNftTransfers = ({ address = "" }) => {
  const dispatch = useDispatch();
  const { transactionHeightAddress, AddressPages, nftTransferstransactions } =
    useSelector((state) => state.transactions);
  const lastID =
    nftTransferstransactions?.[nftTransferstransactions.length - 1]?.number;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(ITEMS_PER_PAGE);

  const handleRowsChange = (rows) => {
    setLimit(rows);
  };
  useEffect(() => {
    const lowerCaseAddress = address.toLowerCase();
    dispatch.transactions.getNFTransfersTransactionWithPagination({
      address: lowerCaseAddress,
      page,
      limit,
      lastID,
    });

    // eslint-disable-next-line
  }, [address, limit, page]);

  return (
    <>
      <div className="bg-white  border border-bryt-grey-200 rounded-[12px] shadow-txBox mt-3">
        <div className="flex items-center justify-between py-5 px-[17px]">
          <div className="flex items-center gap-2">
            <img src={ASSETS.arrowDownList} alt="" />
            <p className="text-[14.5px]">
              Latest {nftTransferstransactions?.length} from a total of{" "}
              <span className="text-bryt-primary-main">
                {transactionHeightAddress ? transactionHeightAddress : 0}
              </span>{" "}
              NFT Transfers
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              onClick={() =>
                downloadAsCSV(
                  nftTransferstransactions,
                  `account_nft_transfer_transactions_${page}.csv`
                )
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
                <td className="">
                  <img src={ASSETS.infoLight} alt="" />
                </td>
                <td className="text-[11.5px] font-bold text-white">
                  Transaction Hash
                </td>
                <td className="text-[11.5px] font-bold text-white">Block</td>

                <td className="text-[11.5px] font-bold text-white">From</td>
                <td className="text-[11.5px] font-bold text-white">To</td>
                <td className="text-[11.5px] font-bold text-white">
                  <div className="flex items-center gap-1">
                    <span className="text-inherit">Type</span>
                    <img src={ASSETS.infoGrey} alt="" />
                  </div>
                </td>
                <td className="text-[11.5px] font-bold text-white">Token</td>
                <td className="text-[11.5px] font-bold text-white">Age</td>
              </tr>
            </thead>
            <tbody>
              {nftTransferstransactions?.length > 0 ? (
                nftTransferstransactions.map((erc) => (
                  <tr
                    key={erc?.id}
                    className="h-12 [&_td]:px-4 [&_td]:border-b [&_td]:border-b-bryt-grey-200"
                  >
                    <td>
                      <div className="w-[28px] h-[28px] rounded-md border border-bryt-grey-200 grid place-items-center">
                        <img src={ASSETS.eye} alt="" />
                      </div>
                    </td>
                    <td className="text-[14.5px] text-bryt-primary-main">
                      {erc?.transaction_hash ? (
                        <Link to={`/tx/${erc?.transaction_hash}`}>
                          <p className="text-[12.5px] text-bryt-primary-main  overflow-hidden text-ellipsis hover:underline hover:text-blue-600">
                            {shortenString(erc?.transaction_hash)}
                          </p>
                        </Link>
                      ) : (
                        "GENISIS_TRANSACTION"
                      )}
                    </td>

                    <td className="text-[12.5px] text-bryt-grey-700">
                      {erc?.block_number}
                    </td>
                    <td className="">
                      <div className="flex items-center gap-2">
                        <p
                          className="text-[12.5px] px-2 rounded-md flex justify-center items-center
                   border-2 border-transparent 
                   hover:bg-bryt-grey-200
                   hover:border-bryt-primary-main 
                   hover:border-dotted"
                        >
                          <Link to={`/address/${erc?.from}`}>
                            <p className="text-[12.5px] text-bryt-primary-main  overflow-hidden text-ellipsis">
                              {shortenString(erc?.from)}
                            </p>
                          </Link>
                        </p>
                        <img
                          src={ASSETS.copy}
                          className="cursor-pointer"
                          onClick={() =>
                            handleCopy(erc?.from, "Wallet address copied!")
                          }
                          alt=""
                        />
                      </div>
                    </td>

                    <td className="">
                      <div className="flex items-center gap-2">
                        <p
                          className="text-[12.5px] px-2 rounded-md flex justify-center items-center
                   border-2 border-transparent 
                   hover:bg-bryt-grey-200
                   hover:border-bryt-primary-main 
                   hover:border-dotted"
                        >
                          <Link to={`/address/${erc?.to}`}>
                            <p className="text-[12.5px] text-bryt-primary-main  overflow-hidden text-ellipsis">
                              {shortenString(erc?.to)}
                            </p>
                          </Link>
                        </p>
                        <img
                          src={ASSETS.copy}
                          className="cursor-pointer"
                          onClick={() =>
                            handleCopy(erc?.to, "Wallet address copied!")
                          }
                          alt=""
                        />
                      </div>
                    </td>

                    <td>
                      <div className="h-6 w-[120px] rounded-md border border-bryt-grey-200 grid place-items-center bg-bryt-grey-100">
                        <p className="text-[11px]">{erc?.token_type}</p>
                      </div>
                    </td>
                    <td className="text-[12.5px] text-bryt-grey-700">
                      {shortenString(erc?.token_address)}
                    </td>
                    <td className="text-[12.5px] text-bryt-grey-700">
                      {dayjs(Number(erc?.timestamp)).fromNow()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No NFT Transfers Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {nftTransferstransactions &&
            nftTransferstransactions.length > 0 &&
            AddressPages > 0 && (
              <div className="flex flex-col lg:flex-row lg:items-center justify-start lg:justify-between py-5 px-[17px]">
                <RowsPerPageDropdown onChange={handleRowsChange} />
                <Pagination
                  pages={AddressPages}
                  page={page}
                  setPage={setPage}
                />
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default AccountNftTransfers;
