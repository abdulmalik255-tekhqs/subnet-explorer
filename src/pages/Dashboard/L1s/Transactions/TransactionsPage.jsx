import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import { ArrowLeft } from "@phosphor-icons/react";
import Navbar from "../../DashboardComponent/Navbar";
import Pagination from "../Pagination";
import StatusBadge from "./StatusBadge";
import { formatTokenAmount } from "../../../../utils";
import ClipBoardComponet from "../../../../components/Pagination/ClipBoard";

dayjs.extend(utc);
dayjs.extend(relativeTime);

const PAGE_SIZE = 10;

const truncateHash = (hash = "") =>
  hash.length > 14 ? `${hash.slice(0, 10)}…${hash.slice(-8)}` : hash;

// Transactions are numbered sequentially, so a page's cursor can be derived
// directly from the highest known transaction number instead of walking
// through every page.
const getLastIdForPage = (page, total) => {
  if (page <= 1) return "0";
  return String(total - (page - 1) * PAGE_SIZE + 1);
};

export default function TransactionsPage() {
  const { chainId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    orbitTransactions,
    orbitTransactionsLoading,
    orbitTransactionsTotal,
  } = useSelector((s) => s.orbit);

  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
    if (chainId) {
      dispatch.orbit.handleGetOrbitTransactionsTotal({ chainId, limit: "1" });
    }
  }, [dispatch, chainId]);

  const total = Number(orbitTransactionsTotal ?? 0);
  const totalPages =
    orbitTransactionsTotal != null
      ? Math.max(1, Math.ceil((total + 1) / PAGE_SIZE))
      : 1;

  const currentLastId = useMemo(
    () => getLastIdForPage(page, total),
    [page, total],
  );

  useEffect(() => {
    if (chainId && orbitTransactionsTotal != null) {
      dispatch.orbit.handleGetOrbitTransactions({
        chainId,
        lastId: currentLastId,
        limit: String(PAGE_SIZE),
      });
    }
  }, [dispatch, chainId, currentLastId, orbitTransactionsTotal]);

  const transactions = orbitTransactions ?? [];

  return (
    <div className="min-h-screen bg-[#060B15] text-white -m-5">
      <Navbar />

      <div className="px-6 py-5 space-y-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft size={12} /> Back
          </button>
          <span>/</span>
          <span>Chain {chainId}</span>
          <span>/</span>
          <span className="text-gray-300">Transactions</span>
        </div>

        <h1 className="text-2xl font-bold text-white">Transactions</h1>

        <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-800/60">
                  <th className="text-left px-5 py-2.5 text-gray-500 font-medium">
                    Tx Hash
                  </th>
                  <th className="text-left px-3 py-2.5 text-gray-500 font-medium">
                    From
                  </th>
                  <th className="text-left px-3 py-2.5 text-gray-500 font-medium">
                    To
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
                {orbitTransactionsLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-10 text-gray-600 text-xs"
                    >
                      Loading…
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-10 text-gray-600 text-xs"
                    >
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
                        <span className="text-blue-400 font-mono hover:text-blue-300 cursor-pointer flex items-center gap-2">
                          <span
                            onClick={() =>
                              navigate(`/orbit/${chainId}/tx/${row.hash}`)
                            }
                          >
                            {truncateHash(row.hash)}
                          </span>
                          <ClipBoardComponet
                            val={row.hash}
                            message="Hash copied!"
                          />
                        </span>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-gray-300">
                        <span className="hover:text-blue-300 cursor-pointer flex items-center gap-2">
                          <span
                            onClick={() =>
                              navigate(`/orbit/${chainId}/address/${row.from}`)
                            }
                          >
                            {truncateHash(row.from)}
                          </span>
                          <ClipBoardComponet
                            val={row.from}
                            message="Address copied!"
                          />
                        </span>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-gray-300">
                        <span className="hover:text-blue-300 cursor-pointer flex items-center gap-2">
                          <span
                            onClick={() =>
                              navigate(`/orbit/${chainId}/address/${row.to}`)
                            }
                          >
                            {truncateHash(row.to)}
                          </span>
                          <ClipBoardComponet
                            val={row.to}
                            message="Address copied!"
                          />
                        </span>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-gray-300">
                        {formatTokenAmount(row.value)} RYT
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

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
