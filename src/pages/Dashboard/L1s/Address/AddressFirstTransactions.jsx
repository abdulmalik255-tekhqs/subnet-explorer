import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { ArrowRight } from "@phosphor-icons/react";
import StatusBadge from "../Transactions/StatusBadge";
import { truncateHash } from "./addressUtils";

export default function AddressFirstTransactions({ chainId, address }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { firstTransactionsByAddress, firstTransactionsByAddressLoading } =
    useSelector((s) => s.orbit);

  useEffect(() => {
    if (chainId && address) {
      dispatch.orbit.handleGetFirstTransactionsByAddress({ chainId, address });
    }
  }, [dispatch, chainId, address]);

  const firstTxs = firstTransactionsByAddress ?? [];

  return (
    <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-800">
        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
          First Transactions
        </span>
      </div>
      {firstTransactionsByAddressLoading && firstTxs.length === 0 ? (
        <div className="h-24 flex items-center justify-center text-gray-600 text-sm">
          Loading…
        </div>
      ) : firstTxs.length === 0 ? (
        <div className="h-24 flex items-center justify-center text-gray-600 text-sm">
          No transactions found
        </div>
      ) : (
        firstTxs.map((txRow, i) => (
          <div
            key={txRow.id ?? i}
            className={`px-5 py-3 ${
              i === firstTxs.length - 1 ? "" : "border-b border-gray-800/40"
            }`}
          >
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span
                onClick={() => navigate(`/orbit/${chainId}/tx/${txRow.hash}`)}
                className="text-xs font-mono text-blue-400 hover:text-blue-300 cursor-pointer truncate"
              >
                {truncateHash(txRow.hash)}
              </span>
              <div className="flex items-center gap-3 flex-shrink-0">
                <StatusBadge status={txRow.transaction_status} />
                <span className="text-[11px] text-gray-600">
                  {dayjs(Number(txRow.timestamp)).fromNow()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-xs">
              <span className="text-gray-500">From</span>
              <span
                onClick={() =>
                  navigate(`/orbit/${chainId}/address/${txRow.from}`)
                }
                className="font-mono text-gray-300 hover:text-blue-300 cursor-pointer"
              >
                {truncateHash(txRow.from)}
              </span>
              <ArrowRight size={11} className="text-gray-600" />
              <span className="text-gray-500">To</span>
              <span
                onClick={() =>
                  navigate(`/orbit/${chainId}/address/${txRow.to}`)
                }
                className="font-mono text-gray-300 hover:text-blue-300 cursor-pointer"
              >
                {truncateHash(txRow.to)}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
