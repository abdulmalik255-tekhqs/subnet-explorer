import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdArrowRightAlt } from "react-icons/md";
import dayjs from "dayjs";

import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link } from "react-router-dom";
import { downloadAsCSV, shortenString } from "../../utils";
import Pagination from "../../components/Pagination/Pagination";
import { ITEMS_PER_PAGE } from "../../app.config";
import RowsPerPageDropdown from "../../components/Pagination/PageSelector";
import ASSETS from "../../assets";
import ClipBoardComponet from "../../components/Pagination/ClipBoard";
import { formatEther } from "ethers";

dayjs.extend(utc);
dayjs.extend(relativeTime);

const Transactions = () => {
  const dispatch = useDispatch();
  const { transactions, pages, transactionHeight } = useSelector(
    (state) => state.transactions,
  );

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(ITEMS_PER_PAGE);

  const handleRowsChange = (rows) => {
    setLimit(rows);
  };
  useEffect(() => {
    dispatch.transactions.handleGetLatestTransactionId();
    dispatch.transactions.getTransactionWithPagination({ page, limit });
    // eslint-disable-next-line
  }, [page, limit]);

  return (
    <>
      <div className="pt-8 px-20">
        <p className="inline-flex text-[16px] w-full text-bryt-primary-main font-semibold gap-3 border-b border-b-bryt-primary-main pb-4">
          Transactions
        </p>
      </div>
      <div className="px-20 py-8">
        <>
          <div className="bg-white border border-bryt-grey-200 rounded-[12px] shadow-txBox">
            <div className="flex flex-col lg:flex-row items-center justify-between py-5 px-[17px]">
              <div className="flex items-center gap-2">
                <img src={ASSETS.arrowDownList} alt="" />
                <p className="text-[14.5px]">
                  Latest {transactions?.length || 0} from a total of{" "}
                  <span className="text-bryt-primary-main">
                    {transactionHeight}
                  </span>{" "}
                  transactions
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div
                  onClick={() =>
                    downloadAsCSV(transactions, `transactions_page_${page}.csv`)
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
                      </div>
                    </td>
                    <td className="text-[11.5px] font-bold text-white">
                      <div className="flex items-center gap-1">
                        <span className="text-inherit">Method</span>
                      </div>
                    </td>
                    <td className="text-[11.5px] font-bold text-white">
                      Block
                    </td>
                    {/* <td className="text-[12.5px] font-bold text-white"></td> */}
                    <td className="text-[11.5px] font-bold text-white">From</td>
                    <td className="text-[11.5px] font-bold text-white">To</td>
                    <td className="text-[11.5px] font-bold text-white">
                      Value
                    </td>
                    {/* <td className="text-[12.5px] font-bold text-white">
                      Txn Fee
                    </td> */}
                    <td className="text-[11.5px] font-bold text-white">Age</td>
                    {/* <td className="text-[12.5px] font-bold text-white">
                      Number
                    </td> */}
                  </tr>
                </thead>
                <tbody>
                  {transactions?.map((transaction) => (
                    <tr
                      key={transaction?.id}
                      className="h-12 [&_td]:px-4 [&_td]:border-b [&_td]:border-b-bryt-grey-200
              [&:last-of-type_td]:border-b-0"
                    >
                      <td>
                        <div className="w-[28px] h-[28px] rounded-md border border-bryt-grey-200 grid place-items-center">
                          <img src={ASSETS.eye} alt="" />
                        </div>
                      </td>
                      <td className="text-[14.5px] text-bryt-primary-main">
                        <div className="flex gap-2">
                          <Link to={`/tx/${transaction?.id}`}>
                            <p className="flex gap-2 text-[12.5px] text-bryt-primary-main  overflow-hidden text-ellipsis hover:underline hover:text-blue-600">
                              {shortenString(transaction?.hash)}
                            </p>
                          </Link>
                          <ClipBoardComponet
                            val={transaction?.hash}
                            message={"Hash copied!"}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="h-6 w-[120px] rounded-md border border-bryt-grey-200 grid place-items-center bg-bryt-grey-100">
                          <p className="text-[11px]">
                            {transaction?.transaction_type ?? "N/A"}
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
                      {/* <td className="text-[14.5px]">
                    {dayjs.utc(transaction?.transaction_time).fromNow()}
                  </td> */}
                      <td className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Link to={`/address/${transaction?.from}`}>
                            <p
                              className="text-[12.5px] px-2 rounded-md flex justify-center items-center
                   border-2 border-transparent 
                   hover:bg-bryt-grey-200
                   hover:border-bryt-primary-main 
                   hover:border-dotted"
                            >
                              {shortenString(transaction?.from)}
                            </p>
                          </Link>
                          <ClipBoardComponet
                            val={transaction?.from}
                            message={"Wallet address copied!"}
                          />
                          <div className="ml-2 bg-bryt-grey-100 p-1 rounded-full">
                            <MdArrowRightAlt className="text-bryt-primary-main" />
                          </div>
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
                            <Link to={`/address/${transaction?.from}`}>
                              {transaction?.to
                                ? shortenString(transaction?.to)
                                : "N/A"}
                            </Link>
                          </p>
                          <ClipBoardComponet
                            val={transaction?.to}
                            message={"Wallet address copied!"}
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
                      {/* <td className="text-[12.5px] text-bryt-grey-700">
                        {Number(transaction?.gas) *
                          Number(transaction?.gas_price)}
                      </td> */}
                      <td className="text-[12.5px] text-bryt-grey-700">
                        {dayjs(Number(transaction?.timestamp)).fromNow()}
                      </td>
                      {/* <td className="text-[12.5px] text-bryt-grey-700">
                        {transaction?.number}
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {transactions && transactions.length > 0 && pages > 0 && (
            <div className="flex flex-col lg:flex-row lg:items-center justify-start lg:justify-between py-5 px-[17px]">
              <RowsPerPageDropdown onChange={handleRowsChange} />
              <Pagination pages={pages} page={page} setPage={setPage} />
            </div>
          )}
        </>

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

export default Transactions;
