import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoIosExpand } from "react-icons/io";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { shortenString, formatTokenAmount } from "../../../utils";
import useTheme from "../../../hooks/useTheme";
import TransactionsModal from "./TransactionsModal";
dayjs.extend(relativeTime);

const LIVE_LIST_LIMIT = 30;

const isSuccessTransaction = (status) => {
  const normalized = String(status || "").toUpperCase();
  return (
    normalized === "SUCCESS" || normalized === "1" || normalized === "TRUE"
  );
};

const mergeByHash = (incoming = [], existing = []) => {
  const txMap = new Map();
  [...incoming, ...existing].forEach((tx) => {
    if (tx?.hash && !txMap.has(tx.hash)) {
      txMap.set(tx.hash, tx);
    }
  });
  return Array.from(txMap.values());
};

const TransactionsTable = () => {
  const { isDarkTheme } = useTheme();
  const dispatch = useDispatch();
  const { transactions } = useSelector((state) => state.transactions);
  const [txs, setTxs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalRows, setModalRows] = useState(10);
  const [newTxHashes, setNewTxHashes] = useState(new Set());
  const mountedOnceRef = useRef(false);

  const cardRows = useMemo(() => txs.slice(0, 7), [txs]);

  useEffect(() => {
    dispatch.transactions.handleGetAllTxs();
    const interval = setInterval(() => {
      dispatch.transactions.handleGetAllTxs();
    }, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    const latestSuccessful = (transactions || []).filter((tx) =>
      isSuccessTransaction(tx?.transaction_status),
    );

    if (!latestSuccessful.length) return;

    setTxs((prev) => {
      if (!mountedOnceRef.current) {
        mountedOnceRef.current = true;
        return latestSuccessful.slice(0, LIVE_LIST_LIMIT);
      }

      const prevHashes = new Set(prev.map((tx) => tx?.hash));
      const onlyNew = latestSuccessful.filter(
        (tx) => tx?.hash && !prevHashes.has(tx.hash),
      );

      if (onlyNew.length) {
        setNewTxHashes((current) => {
          const next = new Set(current);
          onlyNew.forEach((tx) => next.add(tx.hash));
          return next;
        });

        window.setTimeout(() => {
          setNewTxHashes((current) => {
            const next = new Set(current);
            onlyNew.forEach((tx) => next.delete(tx.hash));
            return next;
          });
        }, 1800);
      }

      return mergeByHash(onlyNew, prev).slice(0, LIVE_LIST_LIMIT);
    });
  }, [transactions]);

  const renderCardStatusBadge = (tx) => {
    if (isSuccessTransaction(tx?.transaction_status)) {
      return (
        <span
          className={`inline-flex items-center gap-[4px] text-[10px] font-[700] ${isDarkTheme ? "text-[#00B277] bg-[#171717] border border-[#074626]" : "text-[#00B277] bg-[#E6FFFA] border border-[#00B277]"} rounded-[4px] px-[8px] py-[2px]`}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="5" cy="5" r="5" fill="#00B277" />
            <path
              d="M3 5.2L4.4 6.5L7 3.5"
              stroke="white"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          SUCCESS
        </span>
      );
    }

    return (
      <span
        className={`inline-flex items-center gap-[4px] text-[10px] font-[600] ${isDarkTheme ? "text-[#EF4444] bg-[#2D0A0A] border border-[#7F1D1D]" : "text-[#EF4444] bg-[#FFE6E6] border border-[#EF4444]"} rounded-[4px] px-[8px] py-[3px]`}
      >
        FAILED
      </span>
    );
  };

  const renderCardRows = (rows = []) => {
    if (!rows.length) {
      return (
        <tr>
          <td
            colSpan={4}
            className="text-center py-6 text-[12px] text-[#64748B]"
          >
            No successful transactions found.
          </td>
        </tr>
      );
    }

    return rows.map((tx, index) => {
      const isNewRow = tx?.hash && newTxHashes.has(tx.hash);
      return (
        <tr
          key={tx?.hash || tx?.id || index}
          className={`${isDarkTheme ? "border-b border-[#18212E] bg-[#0D0D0D] hover:bg-[#0F1520]" : "border-b border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]"} transition-all duration-500 ${
            isNewRow
              ? isDarkTheme
                ? "bg-[#0D1B17] shadow-[inset_0_0_0_1px_rgba(0,178,119,0.25)]"
                : "bg-[#F0FFF8] shadow-[inset_0_0_0_1px_rgba(0,178,119,0.2)]"
              : ""
          }`}
        >
          <td className="px-[16px] py-[11px] flex flex-col gap-[4px]">
            <span
              className={`text-[14px] font-[700] ${isDarkTheme ? "text-[#528CEB]" : "text-[#3B7EE8]"} leading-[18px]`}
            >
              {shortenString(tx?.hash)}
            </span>
            <span className="text-[10px] text-[#64748B] leading-[15px] font-[400]">
              Block {tx?.block}
            </span>
          </td>

          <td className="px-[16px] py-[11px]">
            <span
              className={`inline-block text-[10px] font-[700] ${isDarkTheme ? "text-[#45556C] bg-[#171717] border border-[#17212E]" : "text-[#45556C] bg-[#F1F5F9] border border-[#E2E8F0]"} rounded-[4px] px-[6px] py-[1.5px] uppercase tracking-[0.4px]`}
            >
              {tx?.transaction_type || tx?.function_name || "Transfer"}
            </span>
          </td>

          <td className="px-[16px] py-[11px]">
            <span
              className={`text-[12px] font-[700] ${isDarkTheme ? "text-[#C4CFE1]" : "text-[#1E293B]"} leading-[16px]`}
            >
              {formatTokenAmount(tx?.value)} RYT
            </span>
          </td>

          <td className="px-[16px] py-[11px] text-right">
            {renderCardStatusBadge(tx)}
          </td>
        </tr>
      );
    });
  };

  return (
    <>
      <div
        className={`border ${isDarkTheme ? "border-[#18212E]" : "border-[#E2E8F0]"} rounded-[8px] overflow-hidden h-full`}
      >
        <div
          className={`flex justify-between items-center px-[16px] py-[14px] ${isDarkTheme ? "bg-[#0D0D0D] border-b border-[#18212E]" : "bg-[#FFFFFF] border-b border-[#E2E8F0]"}`}
        >
          <div className="flex items-center gap-[10px]">
            <h1
              className={`${isDarkTheme ? "text-[#C4CFE1]" : "text-[#1E293B]"} text-[14px] font-[700] leading-[20px] uppercase tracking-[0.7px]`}
            >
              Latest Successful Transactions
            </h1>
            <span
              className={`inline-flex items-center gap-[4px] px-[6px] py-[2px] rounded-[999px] text-[10px] font-[700] tracking-[0.4px] ${isDarkTheme ? "text-[#00B277] bg-[#171717] border border-[#074626]" : "text-[#00B277] bg-[#F0FFF8] border border-[#9EE8C8]"}`}
            >
              <span className="h-[6px] w-[6px] rounded-full bg-[#00B277] animate-pulse" />{" "}
              LIVE
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className={`${isDarkTheme ? "text-[#3B7EE8] hover:text-[#74A9F4]" : "text-[#3B7EE8] hover:text-[#2456A6]"} flex justify-center items-center gap-[5px] text-[12px] font-[700] leading-[16px] hover:underline`}
          >
            Expand
            <IoIosExpand />
          </button>
        </div>

        <div className="w-full overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr
                className={`${isDarkTheme ? "bg-[#121212] border-b border-[#18212E]" : "bg-[#F8FAFC] border-b border-[#E2E8F0]"}`}
              >
                <th className="text-left text-[12px] font-[600] leading-[16px] text-[#64748B] uppercase tracking-[0.6px] px-[16px] py-[8px]">
                  Txn Hash
                </th>
                <th className="text-left text-[12px] font-[600] leading-[16px] text-[#64748B] uppercase tracking-[0.6px] px-[16px] py-[8px]">
                  Method
                </th>
                <th className="text-left text-[12px] font-[600] leading-[16px] text-[#64748B] uppercase tracking-[0.6px] px-[16px] py-[8px]">
                  Value
                </th>
                <th className="text-right text-[12px] font-[600] leading-[16px] text-[#64748B] uppercase tracking-[0.6px] px-[16px] py-[8px]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-b-0">
              {renderCardRows(cardRows)}
            </tbody>
          </table>
        </div>
      </div>

      <TransactionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isDarkTheme={isDarkTheme}
        modalRows={modalRows}
        setModalRows={setModalRows}
        txs={txs}
        newTxHashes={newTxHashes}
      />
    </>
  );
};

export default TransactionsTable;
