import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import Navbar from "../../DashboardComponent/Navbar";
import StatusBadge from "./StatusBadge";

const PAGE_SIZE = "10";

const truncateHash = (hash = "") =>
  hash.length > 14 ? `${hash.slice(0, 10)}…${hash.slice(-8)}` : hash;

const fmtAge = (timestamp) => {
  const ts = Number(timestamp);
  if (!ts) return "—";
  const diffSec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (diffSec < 60) return `${diffSec}s`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m`;
  return `${Math.floor(diffSec / 3600)}h`;
};

export default function TransactionsPage() {
  const { chainId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orbitTransactions, orbitTransactionsLoading } = useSelector(
    (s) => s.orbit,
  );

  // Keyset pagination: lastIdStack[pageIndex] is the lastId used to fetch that page.
  const [lastIdStack, setLastIdStack] = useState(["0"]);
  const [pageIndex, setPageIndex] = useState(0);
  const currentLastId = lastIdStack[pageIndex];

  useEffect(() => {
    if (chainId) {
      dispatch.orbit.handleGetOrbitTransactions({
        chainId,
        lastId: currentLastId,
        limit: PAGE_SIZE,
      });
    }
  }, [dispatch, chainId, currentLastId]);

  const transactions = orbitTransactions ?? [];
  const hasNext = transactions.length === Number(PAGE_SIZE);

  const handleNext = () => {
    const lastNumber = transactions[transactions.length - 1]?.number;
    if (!lastNumber) return;
    setLastIdStack((prev) => [...prev.slice(0, pageIndex + 1), lastNumber]);
    setPageIndex((p) => p + 1);
  };

  const handlePrev = () => {
    setPageIndex((p) => Math.max(0, p - 1));
  };

  return (
    <div className="min-h-screen bg-[#060B15] text-white -m-5">
      <Navbar />

      <div className="px-6 py-5 space-y-4">
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
                        <span className="text-blue-400 font-mono">
                          {truncateHash(row.hash)}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-gray-300">
                        {truncateHash(row.from)}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-gray-300">
                        {truncateHash(row.to)}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-gray-300">
                        {row.value}
                      </td>
                      <td className="px-3 py-2.5">
                        <StatusBadge status={row.transaction_status} />
                      </td>
                      <td className="px-5 py-2.5 text-right text-gray-500">
                        {fmtAge(row.timestamp)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-800/60">
            <span className="text-[11px] text-gray-600">
              Page {pageIndex + 1}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={pageIndex === 0}
                onClick={handlePrev}
                className="px-2.5 py-1 rounded-md border border-gray-800 bg-[#0B111D] text-gray-500 text-xs font-bold disabled:opacity-30 hover:border-gray-700 hover:text-gray-300 transition-colors"
              >
                ←
              </button>
              <button
                disabled={!hasNext}
                onClick={handleNext}
                className="px-2.5 py-1 rounded-md border border-gray-800 bg-[#0B111D] text-gray-500 text-xs font-bold disabled:opacity-30 hover:border-gray-700 hover:text-gray-300 transition-colors"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
