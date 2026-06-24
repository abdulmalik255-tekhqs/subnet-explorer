import React, { useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { shortenString, formatTokenAmount } from "../../../utils";

const TransactionsModal = ({
  isOpen,
  onClose,
  isDarkTheme,
  modalRows,
  setModalRows,
  txs,
  newTxHashes,
}) => {
  const modalRowsData = (txs || []).slice(0, modalRows);

  const renderStatusBadge = (tx) => {
    const normalized = String(tx?.transaction_status || "").toUpperCase();
    const isSuccess =
      normalized === "SUCCESS" || normalized === "1" || normalized === "TRUE";

    if (isSuccess) {
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

  const renderModalRows = (rows = []) => {
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
      const isNewRow = tx?.hash && newTxHashes?.has(tx.hash);
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
            {renderStatusBadge(tx)}
          </td>
        </tr>
      );
    });
  };

  useEffect(() => {
    const onEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", onEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", onEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#020617]/60 px-[14px] py-[20px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Latest successful transactions"
        onClick={(event) => event.stopPropagation()}
        className={`w-full max-w-[1100px] rounded-[14px] border shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 ${isDarkTheme ? "bg-[#0D0D0D] border-[#18212E]" : "bg-white border-[#E2E8F0]"}`}
      >
        <div
          className={`flex flex-col gap-[10px] sm:flex-row sm:items-center sm:justify-between px-[16px] py-[14px] border-b ${isDarkTheme ? "border-[#18212E] bg-[#0D0D0D]" : "border-[#E2E8F0] bg-[#FFFFFF]"}`}
        >
          <div className="flex items-center gap-[10px]">
            <h2
              className={`${isDarkTheme ? "text-[#C4CFE1]" : "text-[#1E293B]"} text-[14px] font-[700] leading-[20px] uppercase tracking-[0.7px]`}
            >
              Latest Successful Transactions
            </h2>
            <span
              className={`inline-flex items-center gap-[4px] px-[6px] py-[2px] rounded-[999px] text-[10px] font-[700] tracking-[0.4px] ${isDarkTheme ? "text-[#00B277] bg-[#171717] border border-[#074626]" : "text-[#00B277] bg-[#F0FFF8] border border-[#9EE8C8]"}`}
            >
              <span className="h-[6px] w-[6px] rounded-full bg-[#00B277] animate-pulse" />
              LIVE
            </span>
          </div>

          <div className="flex items-center gap-[10px]">
            <button
              type="button"
              onClick={onClose}
              className={`h-[30px] w-[30px] rounded-[6px] border grid place-items-center transition-colors ${isDarkTheme ? "border-[#2A3445] bg-[#121212] text-[#C4CFE1] hover:bg-[#18212E]" : "border-[#CBD5E1] bg-white text-[#1E293B] hover:bg-[#F8FAFC]"}`}
              aria-label="Close latest successful transactions modal"
            >
              <IoCloseOutline className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10">
              <tr
                className={`${isDarkTheme ? "bg-[#121212] border-b border-[#18212E]" : "bg-[#F8FAFC] border-b border-[#E2E8F0]"}`}
              >
                <th className="text-left text-[12px] font-[600] leading-[16px] text-[#64748B] uppercase tracking-[0.6px] px-[16px] py-[10px]">
                  Txn Hash
                </th>
                <th className="text-left text-[12px] font-[600] leading-[16px] text-[#64748B] uppercase tracking-[0.6px] px-[16px] py-[10px]">
                  Method
                </th>
                <th className="text-left text-[12px] font-[600] leading-[16px] text-[#64748B] uppercase tracking-[0.6px] px-[16px] py-[10px]">
                  Value
                </th>
                <th className="text-right text-[12px] font-[600] leading-[16px] text-[#64748B] uppercase tracking-[0.6px] px-[16px] py-[10px]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-b-0">
              {renderModalRows(modalRowsData)}
            </tbody>
          </table>
        </div>

        <div
          className={`px-[16px] py-[12px] border-t text-[11px] text-[#64748B] ${isDarkTheme ? "border-[#18212E] bg-[#0D0D0D]" : "border-[#E2E8F0] bg-[#FFFFFF]"}`}
        >
          Refreshes every 10s. Only newly detected successful transactions are
          inserted and highlighted.
        </div>
      </div>
    </div>
  );
};

export default TransactionsModal;
