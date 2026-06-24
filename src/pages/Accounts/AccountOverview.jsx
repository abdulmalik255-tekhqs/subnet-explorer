import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link } from "react-router-dom";
import RowsPerPageDropdown from "../../components/Pagination/PageSelector";
import Pagination from "../../components/Pagination/Pagination";
import { downloadAsCSV, handleCopy, shortenString } from "../../utils";
import ASSETS from "../../assets";
import { useDispatch, useSelector } from "react-redux";
import { ITEMS_PER_PAGE } from "../../app.config";
import ClipBoardComponet from "../../components/Pagination/ClipBoard";
import { formatEther } from "ethers";

dayjs.extend(relativeTime);

const AccountOverview = ({ address = "" }) => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(ITEMS_PER_PAGE);

  const handleRowsChange = (rows) => {
    setLimit(rows);
  };
  const { AddressTransactions, addressHeightAddress, AddressPages } =
    useSelector((state) => state.transactions);
  const lastID = AddressTransactions?.[AddressTransactions.length - 1]?.number;

  useEffect(() => {
    const lowerCaseAddress = address.toLowerCase();

    dispatch.transactions.getTransactionByAddressWithPagination({
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
              Latest {AddressTransactions?.length} from a total of{" "}
              <span className="text-bryt-primary-main">
                {addressHeightAddress ? addressHeightAddress : 0}
              </span>{" "}
              transactions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              onClick={() =>
                downloadAsCSV(
                  AddressTransactions,
                  `account_transactions_${page}.csv`,
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
                <td className="text-[11.5px] font-bold text-white">
                  <div className="flex items-center gap-1">
                    <span className="text-inherit">Type</span>
                    <img src={ASSETS.infoGrey} alt="" />
                  </div>
                </td>
                <td className="text-[11.5px] font-bold text-white">
                  <div className="flex items-center gap-1">
                    <span className="text-inherit">Method</span>
                    <img src={ASSETS.infoGrey} alt="" />
                  </div>
                </td>
                <td className="text-[11.5px] font-bold text-white">Block</td>
                <td className="text-[11.5px] font-bold text-white">From</td>
                <td className="text-[11.5px] font-bold text-white">To</td>
                <td className="text-[11.5px] font-bold text-white">Value</td>
                <td className="text-[11.5px] font-bold text-white">Age</td>
              </tr>
            </thead>
            <tbody>
              {AddressTransactions?.map((transaction) => (
                <tr
                  key={transaction?.id}
                  className="h-12 [&_td]:px-4 [&_td]:border-b [&_td]:border-b-bryt-grey-200"
                >
                  <td>
                    <div className="w-[28px] h-[28px] rounded-md border border-bryt-grey-200 grid place-items-center">
                      <img src={ASSETS.eye} alt="" />
                    </div>
                  </td>
                  <td className="text-[12.5px] text-bryt-primary-main">
                    <div className="flex gap-2">
                      {transaction?.hash ? (
                        <Link to={`/tx/${transaction?.hash}`}>
                          <p className="text-[12.5px] text-bryt-primary-main w-[12ch] overflow-hidden text-ellipsis hover:underline hover:text-blue-600">
                            {transaction?.hash}
                          </p>
                        </Link>
                      ) : (
                        "GENISIS_TRANSACTION"
                      )}
                      <ClipBoardComponet
                        val={transaction?.hash}
                        message={"Hash copied!"}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="h-6 w-[120px] rounded-md border border-bryt-grey-200 grid place-items-center bg-bryt-grey-100">
                      <p className="text-[11px]">
                        {transaction?.transaction_type}
                      </p>
                    </div>
                  </td>
                  <td>
                    <div className="h-6 w-[160px] rounded-md border border-bryt-grey-200 grid place-items-center bg-bryt-grey-100">
                      <p className="text-[11px]">
                        {transaction?.function_name ?? "N/A"}
                      </p>
                    </div>
                  </td>
                  <td className="text-[12.5px] text-bryt-primary-main hover:underline hover:text-blue-600">
                    <Link to={`/block/${transaction?.block}`}>
                      {transaction?.block}
                    </Link>
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
                        {shortenString(transaction?.from)}
                      </p>
                      <img
                        src={ASSETS.copy}
                        className="cursor-pointer"
                        onClick={() =>
                          handleCopy(
                            transaction?.from,
                            "Wallet address copied!",
                          )
                        }
                        alt=""
                      />
                      {transaction?.from === address ? (
                        <div className="px-[6.5px] flex items-center h-6 rounded-md bg-bryt-yellow-light border border-yellow-500 text-yellow-500 text-[11px] font-bold">
                          OUT
                        </div>
                      ) : (
                        <div className="px-[6.5px] flex items-center h-6 rounded-md bg-blue-100 border border-blue-500 text-blue-500 text-[11px] font-bold">
                          IN
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <p
                        className="text-[12.5px] px-2 rounded-md flex justify-center items-center
                   border-2 border-transparent 
                   hover:bg-bryt-grey-200
                   hover:border-bryt-primary-main 
                   hover:border-dotted"
                      >
                        <Link to={`/address/${transaction?.to}`}>
                          {shortenString(transaction?.to)}
                        </Link>
                      </p>
                      <img
                        src={ASSETS.copy}
                        className="cursor-pointer"
                        onClick={() =>
                          handleCopy(transaction?.to, "Wallet address copied!")
                        }
                        alt=""
                      />
                    </div>
                  </td>
                  <td className="text-[12.5px]">
                    {/* {transaction?.value} RYT */}
                    {Number(
                      formatEther(transaction?.value),
                    ).toLocaleString()}{" "}
                    RYT
                    {/* {formatTokenAmount(transaction?.value)} RYT */}
                  </td>
                  <td className="text-[12.5px] text-bryt-grey-700">
                    {dayjs(Number(transaction?.timestamp)).fromNow()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {AddressTransactions &&
            AddressTransactions.length > 0 &&
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

export default AccountOverview;
