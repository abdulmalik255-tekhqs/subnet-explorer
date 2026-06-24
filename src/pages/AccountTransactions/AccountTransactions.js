import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { handleCopy, formatTokenAmount } from "../../utils";
import ASSETS from "../../assets";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../components/Pagination/Pagination";
import { ITEMS_PER_PAGE } from "../../app.config";
import RowsPerPageDropdown from "../../components/Pagination/PageSelector";

dayjs.extend(utc);
dayjs.extend(relativeTime);

const AccountTransactions = ({ address }) => {
  // const address = useParams().id;
  //test
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
    const lastID = transactions?.[transactions.length - 1]?.number;
    dispatch.transactions.getTransactionByAddressWithPagination({
      address,
      page,
      limit,
      lastID,
    });
    // eslint-disable-next-line
  }, [address, page, limit]);
  return (
    <div className="flex-grow bg-blocks px-10 py-5">
      <div className="flex items-center gap-2 mb-2">
        <p className="text-inherit text-[15px] font-semibold">Transactions</p>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-[15px]">For </p>
        <p className="text-[15px] text-bryt-primary-main">{address}</p>
        <div className="flex items-center gap-1">
          <img
            src={ASSETS.copy}
            alt=""
            className="cursor-pointer"
            onClick={() =>
              handleCopy(address, "Wallet address copied successfully")
            }
          />
        </div>
      </div>
      <div className="border-t border-t-bryt-grey-200 mt-[19px]"></div>
      {/* table */}
      <div className="bg-white  border border-bryt-grey-200 rounded-[12px] shadow-txBox mt-3">
        <div className="flex items-center justify-between py-5 px-[17px]">
          <div className="flex items-center gap-2">
            <img src={ASSETS.arrowDownList} alt="" />
            <p className="text-[14.5px]">
              Latest {transactions?.length} from a total of{" "}
              <span className="text-bryt-primary-main">
                {transactionHeight}
              </span>{" "}
              transactions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-[6px] border border-bryt-grey-200 h-[29px] px-[10px] rounded-md cursor-not-allowed">
              <img src={ASSETS.download} alt="" />
              <p className="text-[12.5px]"> Download Page Data</p>
            </div>
            <div className="flex items-center gap-[6px] border border-bryt-grey-200 h-[29px] px-[10px] rounded-md cursor-not-allowed">
              <img src={ASSETS.cone} alt="" />
              <img src={ASSETS.arrowDown} alt="" />
            </div>
          </div>
        </div>
        <div className="w-full overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-bryt-primary-main h-[38px] [&_td]:px-4">
                <td className="">
                  <img src={ASSETS.infoLight} alt="" />
                </td>
                <td className="text-[12.5px] font-bold text-white">
                  Transaction Hash
                </td>
                <td className="text-[12.5px] font-bold text-white">
                  <div className="flex items-center gap-1">
                    <span className="text-inherit">Method </span>
                    <img src={ASSETS.infoGrey} alt="" />
                  </div>
                </td>
                <td className="text-[12.5px] font-bold text-white">Block</td>
                {/* <td className="text-[12.5px] font-bold text-white"></td> */}
                <td className="text-[12.5px] font-bold text-white">From</td>
                <td className="text-[12.5px] font-bold text-white">To</td>
                <td className="text-[12.5px] font-bold text-white">Value</td>
                <td className="text-[12.5px] font-bold text-white"></td>
              </tr>
            </thead>
            <tbody>
              {transactions?.map((transaction) => (
                <tr
                  key={transaction?.id}
                  className="h-12 [&_td]:px-4 [&_td]:border-b [&_td]:border-b-bryt-grey-200
                      "
                >
                  <td>
                    <div className="w-[28px] h-[28px] rounded-md border border-bryt-grey-200 grid place-items-center">
                      <img src={ASSETS.eye} alt="" />
                    </div>
                  </td>
                  <td className="text-[14.5px] text-bryt-primary-main">
                    {transaction?.hash ? (
                      <Link to={`/tx/${transaction?.hash}`}>
                        <p className="text-[14.5px] text-bryt-primary-main w-[12ch] overflow-hidden text-ellipsis">
                          {transaction?.hash}
                        </p>
                      </Link>
                    ) : (
                      "GENISIS_TRANSACTION"
                    )}
                  </td>
                  <td>
                    <div className="h-6 w-[88px] rounded-md border border-bryt-grey-200 grid place-items-center bg-bryt-grey-100">
                      <p className="text-[11px]">
                        {transaction?.transaction_type}
                      </p>
                    </div>
                  </td>
                  <td className="text-[14.5px] text-bryt-primary-main">
                    <Link to={`/block/${transaction?.block}`}>
                      {transaction?.block}
                    </Link>
                  </td>
                  {/* <td className="text-[14.5px]">
                    {dayjs.utc(transaction?.transaction_time).fromNow()}
                  </td> */}
                  <td className="">
                    <div className="flex items-center gap-2">
                      <p className="text-[14.5px]">
                        {transaction?.from?.slice(0, 7)}.
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
                      <p className="text-[14.5px] text-bryt-primary-main">
                        Fee Recipient: {transaction?.to?.slice(0, 5)}.
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
                  <td className="text-[14.5px]">
                    {formatTokenAmount(transaction?.value)} RYT
                  </td>
                  <td className="text-[12.5px] text-bryt-grey-700">
                    {Number(transaction?.gas) * Number(transaction?.gas_price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {transactions && transactions?.length > 0 && pages > 0 && (
        <div className="flex items-center justify-between py-5 px-[17px]">
          <RowsPerPageDropdown onChange={handleRowsChange} />
          <Pagination pages={pages} page={page} setPage={setPage} />
        </div>
      )}
      <div className="flex justify-end">
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
      </div>
      <div className="flex items-start gap-[14.5px] mt-[14px]">
        <img src={ASSETS.bulb} alt="" />
        <p className="text-[12.5px] text-bryt-grey-700">
          Blocks are batches of transactions linked via cryptographic hashes.
          Any tampering of a block would invalidate all following blocks as all
          subsequent hashes would change. Learn more about this page in our{" "}
          <span className="text-bryt-primary-main">Knowledge Base</span>
        </p>
      </div>
    </div>
  );
};

export default AccountTransactions;
