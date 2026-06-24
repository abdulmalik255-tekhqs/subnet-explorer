import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import ASSETS from "../../../assets";
import { shortenString } from "../../../utils";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import { formatEther } from "ethers";

dayjs.extend(utc);
dayjs.extend(relativeTime);

const Transaction = ({ transaction }) => {
  const navigate = useNavigate();
  const disptach = useDispatch();
  const handleNavigate = (e) => {
    e.stopPropagation();
    navigate(`/tx/${transaction?.hash}`);
  };
  const timeAgo = dayjs(Number(transaction?.timestamp)).fromNow();
  return (
    <div
      className="py-[14px] px-4 flex items-center gap-20 cursor-pointer border-b border-b-bryt-grey-200 last-of-type:border-b-0"
      onClick={(e) => handleNavigate(e)}
    >
      <div className="flex items-center gap-2">
        <div className="h-12 w-12 rounded-lg grid place-items-center bg-bryt-grey-100">
          <img src={ASSETS.transaction} alt="" />
        </div>
        <div>
          <p className="text-[14.5px] text-bryt-primary-main overflow-hidden text-ellipsis transition-colors duration-300 group-hover:text-bryt-primary-main">
            {shortenString(transaction?.hash) || "GENESIS_TRANSACTION"}
          </p>
          {/* <p className="text-[14.5px] text-bryt-grey-700">
            {dayjs.utc(transaction?.transaction_time).fromNow()}
          </p> */}
        </div>
      </div>
      <div className="flex-grow flex items-center justify-between gap-2">
        <div>
          <p className="text-[12.5px] cursor-pointer">
            From{" "}
            <Link
              to={`/address/${transaction?.from}`}
              onClick={(e) => {
                e.stopPropagation();
                disptach.transactions.setTransactions([]);
                disptach.transactions.setAddressTransaction([]);
              }}
            >
              <span className="text-bryt-primary-main">
                {shortenString(transaction?.from)}
              </span>
            </Link>
          </p>
          <p className="text-[12.5px] cursor-pointer">
            To{" "}
            <Link
              to={`/address/${transaction?.to}`}
              onClick={(e) => {
                e.stopPropagation();
                disptach.transactions.setTransactions([]);
                disptach.transactions.setAddressTransaction([]);
              }}
            >
              <span className="text-bryt-primary-main">
                {shortenString(transaction?.to)}
              </span>
            </Link>
          </p>
        </div>
        <div>
          <div className="flex justify-end text-[11px] mb-2 text-bryt-primary-main">
            {timeAgo}
          </div>
          <div className="flex justify-center items-center w-auto p-[5px]  border border-bryt-grey-300 rounded-[6px]">
            <p className="text-[12px] font-[500] text-bryt-primary-main pt-[1px]">
              {Number(formatEther(transaction?.value)).toLocaleString()} RYT
              {/* {transaction?.value} RYT */}
              {/* {formatTokenAmount(transaction?.value)} RYT */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Transactions = () => {
  const disptach = useDispatch();
  const { transactions } = useSelector((state) => state.transactions);
  const [txs, setTxs] = useState([]);

  // useEffect(() => {
  //   const txList = [...transactions];
  //   if (txList.length > 7) {
  //     const t = txList.reverse();
  //     setTxs(t.splice(0, 7));
  //   } else {
  //     const t = txList.reverse();
  //     setTxs(t);
  //   }
  // }, [transactions]);
  useEffect(() => {
    if (transactions?.length > 7) {
      setTxs(transactions?.slice(0, 7));
    } else {
      setTxs(transactions);
    }
  }, [transactions]);

  return (
    <div className="border border-bryt-grey-200 rounded-[16px] flex flex-col overflow-hidden shadow-md">
      <div className="bg-footer p-4 flex items-center justify-between">
        <p className="text-[12.5px] font-bold text-bryt-primary-main">
          Latest Transactions
        </p>
        <button className="flex items-center gap-1 px-2 py-[5px] bg-white border border-bryt-grey-200 rounded-[6px] cursor-not-allowed">
          <img src={ASSETS.sortBy} alt="" />
          <p className="text-xs text-bryt-primary-main">Sort by</p>
        </button>
      </div>
      <div>
        {txs?.map((transaction) => (
          <Transaction key={transaction?.hash} transaction={transaction} />
        ))}
      </div>
      <div className="group flex items-center justify-center gap-[10px] p-6 border-t border-t-bryt-grey-200 cursor-pointer">
        <Link
          to="/txs"
          onClick={() => disptach.transactions.setTransactions([])}
          className="flex items-center gap-[10px]"
        >
          {/* Text */}
          <span className="relative text-xs font-semibold text-bryt-grey-700 uppercase transition-colors duration-300 group-hover:text-bryt-primary-main">
            View all transactions
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

export default Transactions;
