import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { useLocation } from "react-router-dom";
import ASSETS from "../../assets";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link } from "react-router-dom";
import { bryt } from "../../http";

dayjs.extend(utc);
dayjs.extend(relativeTime);

const BlockTransactions = ({ block }) => {
  const [tab, setTab] = useState("transactions");
  const txHashes = useLocation().state;
  const [transactions, setTransactions] = useState([]);

  const handleTab = (tab) => {
    setTab(tab);
  };

  const handleTxs = async () => {
    try {
      const result = await Promise.all(
        txHashes.map((hash) => bryt.getTransactionByHash(hash))
      );
      const data = result.map((r) => r.result.transaction);
      setTransactions(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    handleTxs();
    // eslint-disable-next-line
  }, [txHashes]);
  return (
    <div className="px-16 py-8">
      {/* table section */}
      <div className="flex items-center justify-between mt-[32px]">
        <div className="flex items-center gap-2">
          <button
            className={classNames(
              "py-[5px] px-[9px] bg-bryt-grey-200 rounded-lg text-bryt-primary-main",
              tab === "transactions" && "text-white bg-bryt-primary-main"
            )}
            onClick={() => handleTab("transactions")}
          >
            <p className="text-inherit text-[12.6px] font-semibold">
              Transactions
            </p>
          </button>
        </div>
        <div className="flex h-[29px] border border-bryt-grey-200 rounded-md cursor-pointer">
          <div className="flex items-center gap-1 px-2">
            <img src={ASSETS.advanceFilter} alt="" />
            <p className="text-[12.5px]">Advanced Filter</p>
          </div>
          <div className="w-[29px] grid place-items-center border-l border-l-bryt-grey-200">
            <img src={ASSETS.arrowDown} alt="" />
          </div>
        </div>
      </div>
      {/* table */}
      <div className="bg-white  border border-bryt-grey-200 rounded-[12px] shadow-txBox mt-3">
        <div className="flex items-center justify-between py-5 px-[17px]">
          <div className="flex items-center gap-2">
            <img src={ASSETS.arrowDownList} alt="" />
            <p className="text-[14.5px]">
              Latest {transactions?.length} from a total of{" "}
              <span className="text-bryt-primary-main">
                {transactions?.length}
              </span>{" "}
              transactions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-[6px] border border-bryt-grey-200 h-[29px] px-[10px] rounded-md cursor-pointer">
              <img src={ASSETS.download} alt="" />
              <p className="text-[12.5px]"> Download Page Data</p>
            </div>
            <div className="flex items-center gap-[6px] border border-bryt-grey-200 h-[29px] px-[10px] rounded-md cursor-pointer">
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
                <td className="text-[12.5px] font-bold text-white"></td>
                <td className="text-[12.5px] font-bold text-white">From</td>
                <td className="text-[12.5px] font-bold text-white">To</td>
                <td className="text-[12.5px] font-bold text-white">Value</td>
                <td className="text-[12.5px] font-bold text-white"></td>
              </tr>
            </thead>
            <tbody>
              {transactions?.map((transaction) => (
                <tr
                  key={transaction?.ununix_timestamp}
                  className="h-12 [&_td]:px-4 [&_td]:border-b [&_td]:border-b-bryt-grey-200
              [&:last-of-type_td]:border-b-0"
                >
                  <td>
                    <div className="w-[28px] h-[28px] rounded-md border border-bryt-grey-200 grid place-items-center">
                      <img src={ASSETS.eye} alt="" />
                    </div>
                  </td>
                  <td className="text-[14.5px] text-bryt-primary-main">
                    <Link to={`/tx/${transaction?.TransferObj?.hash}`}>
                      <p className="text-[14.5px] text-bryt-primary-main w-[12ch] overflow-hidden text-ellipsis">
                        {transaction?.TransferObj?.hash}
                      </p>
                    </Link>
                  </td>
                  <td>
                    <div className="h-6 w-[88px] rounded-md border border-bryt-grey-200 grid place-items-center bg-bryt-grey-100">
                      <p className="text-[11px]">{transaction?.type}</p>
                    </div>
                  </td>
                  <td className="text-[14.5px] text-bryt-primary-main">
                    POM Block
                  </td>
                  <td className="text-[14.5px]">
                    {dayjs.utc(transaction?.transaction_time).fromNow()}
                  </td>
                  <td className="">
                    <div className="flex items-center gap-2">
                      <p className="text-[14.5px]">
                        {transaction?.TransferObj?.from?.slice(0, 7)}.
                      </p>
                      <img src={ASSETS.copy} alt="" />
                      <div className="px-[6.5px] flex items-center h-6 rounded-md bg-bryt-yellow-light border border-yellow-500 text-yellow-500 text-[11px] font-bold">
                        OUT
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <p className="text-[14.5px] text-bryt-primary-main">
                        Fee Recipient:{" "}
                        {transaction?.TransferObj?.to?.slice(0, 5)}.
                      </p>
                      <img src={ASSETS.copy} alt="" />
                    </div>
                  </td>
                  <td className="text-[14.5px]">
                    {transaction?.TransferObj?.value} RYT
                  </td>
                  <td className="text-[12.5px] text-bryt-grey-700">
                    0.00029593
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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

export default BlockTransactions;
