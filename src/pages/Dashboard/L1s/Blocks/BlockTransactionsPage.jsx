import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import Navbar from "../../DashboardComponent/Navbar";
import ClipBoardComponet from "../../../../components/Pagination/ClipBoard";
import StatusBadge from "../Transactions/StatusBadge";

dayjs.extend(utc);
dayjs.extend(relativeTime);

const FILTERS = ["All", "Success", "Failed"];

const truncateHash = (hash = "") =>
  hash?.length > 14 ? `${hash?.slice(0, 8)}…${hash?.slice(-6)}` : hash;

const truncateMethod = (input = "") =>
  input?.length > 10 ? `${input.slice(0, 10)}…` : input;

const fmtFee = (gas, gasPrice) => {
  const used = Number(gas);
  const price = Number(gasPrice);
  if (!used || !price) return "—";
  return (used * price) / 1e18;
};

export default function BlockTransactionsPage() {
  const { chainId, blockNumber } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { blockTransactions, blockTransactionsLoading } = useSelector(
    (s) => s.orbit,
  );
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (chainId && blockNumber) {
      dispatch.orbit.handleGetBlockTransactions({ chainId, id: blockNumber });
    }
  }, [dispatch, chainId, blockNumber]);

  const transactions = blockTransactions ?? [];

  const filtered = useMemo(() => {
    if (filter === "All") return transactions;
    return transactions?.filter(
      (tx) =>
        (tx?.transaction_status ?? "")?.toLowerCase() === filter?.toLowerCase(),
    );
  }, [transactions, filter]);

  const successCount =
    transactions?.filter(
      (tx) => (tx.transaction_status ?? "")?.toLowerCase() === "success",
    )?.length ?? 0;
  const failedCount = (transactions?.length ?? 0) - successCount;

  return (
    <div className="min-h-screen bg-[#060B15] text-white -m-5">
      <Navbar />

      <div className="px-6 py-5 space-y-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft size={12} /> Back
          </button>
          <span>/</span>
          <span
            onClick={() => navigate(`/subnets/${chainId}/blocks`)}
            className="text-blue-400 hover:text-blue-300 cursor-pointer"
          >
            Blocks
          </span>
          <span>/</span>
          <span
            onClick={() =>
              navigate(`/subnets/${chainId}/blocks/${blockNumber}`)
            }
            className="text-blue-400 hover:text-blue-300 cursor-pointer"
          >
            #{blockNumber}
          </span>
          <span>/</span>
          <span className="text-gray-300">Transactions</span>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Transactions in Block{" "}
              <span className="text-gray-500">#{blockNumber}</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {transactions?.length} transaction
              {transactions?.length === 1 ? "" : "s"}
              {successCount > 0 && (
                <span className="text-green-400">
                  {" "}
                  · {successCount} success
                </span>
              )}
              {failedCount > 0 && (
                <span className="text-red-400"> · {failedCount} failed</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-1 bg-[#111827] border border-gray-800 rounded-lg p-0.5">
            {FILTERS?.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  filter === f
                    ? "bg-[#1E293B] text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {blockTransactionsLoading ? (
          <div className="h-64 flex items-center justify-center text-gray-600 text-sm">
            Loading transactions…
          </div>
        ) : filtered.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-600 text-sm">
            No transactions found
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered?.map((tx) => (
              <div
                key={tx.id}
                className="bg-[#0B111D] border border-gray-800 rounded-xl px-5 py-4 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      onClick={() =>
                        navigate(`/subnets/${chainId}/tx/${tx.hash}`)
                      }
                      className="text-sm font-mono text-blue-400 truncate hover:text-blue-300 cursor-pointer"
                    >
                      {truncateHash(tx.hash)}
                    </span>
                    <ClipBoardComponet val={tx.hash} message="Hash copied!" />
                    {tx.function_name && (
                      <span className="px-2 py-0.5 rounded bg-[#111827] border border-gray-800 text-[10px] font-mono text-gray-400">
                        {truncateMethod(tx.function_name)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <StatusBadge status={tx.transaction_status} />
                    <span className="text-[11px] text-gray-600">
                      {dayjs(Number(tx.timestamp)).fromNow()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2.5 text-xs">
                  <span className="text-gray-500">From</span>
                  <span
                    onClick={() =>
                      navigate(`/subnets/${chainId}/address/${tx.from}`)
                    }
                    className="font-mono text-gray-300 hover:text-blue-300 cursor-pointer"
                  >
                    {truncateHash(tx.from)}
                  </span>
                  <ArrowRight size={11} className="text-gray-600" />
                  <span className="text-gray-500">To</span>
                  <span
                    onClick={() =>
                      navigate(`/subnets/${chainId}/address/${tx.to}`)
                    }
                    className="font-mono text-gray-300 hover:text-blue-300 cursor-pointer"
                  >
                    {truncateHash(tx.to)}
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-2.5 text-xs">
                  <span className="text-gray-500">
                    Value{" "}
                    <span className="text-gray-200 font-mono">
                      {tx.value ?? "0"}
                    </span>
                  </span>
                  <span className="text-gray-500">
                    Fee{" "}
                    <span className="text-gray-200 font-mono">
                      {fmtFee(tx.gas_used, tx.gas_price)}
                    </span>
                  </span>
                  <span className="text-gray-500">
                    Type{" "}
                    <span className="text-gray-300">
                      {tx.transaction_type ?? "—"}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
