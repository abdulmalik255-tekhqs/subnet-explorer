import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import ClipBoardComponet from "../../../../components/Pagination/ClipBoard";
dayjs.extend(utc);
dayjs.extend(relativeTime);

const truncateHash = (hash = "") =>
  hash.length > 14 ? `${hash.slice(0, 8)}…${hash.slice(-6)}` : hash;

export default function LatestTransactions({ chainId, symbol = "RYT" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orbitTransactions, orbitTransactionsLoading } = useSelector(
    (s) => s.orbit,
  );

  useEffect(() => {
    if (chainId) {
      dispatch.orbit.handleGetOrbitTransactions({
        chainId,
        lastId: "0",
        limit: "3",
      });
    }
  }, [dispatch, chainId]);

  const transactions = orbitTransactions ?? [];

  return (
    <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
        <span className="text-sm font-semibold text-white">
          Latest Transactions
        </span>
        <button
          onClick={() => navigate(`/orbit/${chainId}/transactions`)}
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          View all →
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-800/60">
              <th className="text-left px-5 py-2.5 text-gray-500 font-medium">
                Tx Hash
              </th>
              <th className="text-left px-3 py-2.5 text-gray-500 font-medium">
                Value
              </th>
              <th className="text-left px-3 py-2.5 text-gray-500 font-medium">
                Status
              </th>
              <th className="text-right px-5 py-2.5 text-gray-500 font-medium">
                Age
              </th>
            </tr>
          </thead>
          <tbody>
            {orbitTransactionsLoading && transactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-600">
                  Loading…
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-600">
                  No transactions found
                </td>
              </tr>
            ) : (
              transactions.map((row, i) => (
                <tr
                  key={row.id}
                  className={`border-b border-gray-800/40 hover:bg-white/[0.02] transition-colors ${
                    i === transactions.length - 1 ? "border-0" : ""
                  }`}
                >
                  <td className="px-5 py-2.5">
                    <span className="text-blue-400 font-mono flex items-center gap-1">
                      <span
                        onClick={() =>
                          navigate(`/orbit/${chainId}/tx/${row.hash}`)
                        }
                        className="hover:text-blue-300 cursor-pointer"
                      >
                        {truncateHash(row.hash)}
                      </span>
                      <ClipBoardComponet
                        val={row.hash}
                        message={"Hash copied!"}
                      />
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-mono text-gray-300">
                    {row.value} {symbol}
                  </td>
                  <td className="px-3 py-2.5">
                    <StatusBadge status={row.transaction_status} />
                  </td>
                  <td className="px-5 py-2.5 text-right text-gray-500">
                    {dayjs(Number(row.timestamp)).fromNow()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
