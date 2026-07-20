import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import { ArrowLeft } from "@phosphor-icons/react";
import Navbar from "../../DashboardComponent/Navbar";

dayjs.extend(utc);
dayjs.extend(relativeTime);

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

export default function BlocksPage() {
  const { chainId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orbitBlocks, orbitBlocksLoading } = useSelector((s) => s.orbit);

  // Keyset pagination: lastIdStack[pageIndex] is the lastId used to fetch that page.
  const [lastIdStack, setLastIdStack] = useState(["0"]);
  const [pageIndex, setPageIndex] = useState(0);
  const currentLastId = lastIdStack[pageIndex];

  useEffect(() => {
    if (chainId) {
      dispatch.orbit.handleGetOrbitBlocks({
        chainId,
        lastId: currentLastId,
        limit: PAGE_SIZE,
      });
    }
  }, [dispatch, chainId, currentLastId]);

  const blocks = orbitBlocks ?? [];
  const hasNext = blocks.length === Number(PAGE_SIZE);

  const handleNext = () => {
    const lastBlockNumber = blocks[blocks.length - 1]?.block_number;
    if (!lastBlockNumber) return;
    setLastIdStack((prev) => [
      ...prev.slice(0, pageIndex + 1),
      lastBlockNumber,
    ]);
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
          <span className="text-gray-300">Blocks</span>
        </div>

        <h1 className="text-2xl font-bold text-white">Blocks</h1>

        <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-800/60">
                  <th className="text-left px-5 py-2.5 text-gray-500 font-medium">
                    Block
                  </th>
                  <th className="text-left px-3 py-2.5 text-gray-500 font-medium">
                    Hash
                  </th>
                  <th className="text-left px-3 py-2.5 text-gray-500 font-medium">
                    Status
                  </th>
                  <th className="text-left px-3 py-2.5 text-gray-500 font-medium">
                    Txns
                  </th>
                  <th className="text-right px-5 py-2.5 text-gray-500 font-medium">
                    Age
                  </th>
                </tr>
              </thead>
              <tbody>
                {orbitBlocksLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-10 text-gray-600 text-xs"
                    >
                      Loading…
                    </td>
                  </tr>
                ) : blocks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-10 text-gray-600 text-xs"
                    >
                      No blocks found
                    </td>
                  </tr>
                ) : (
                  blocks.map((row, i) => (
                    <tr
                      key={row.id}
                      className={`border-b border-gray-800/40 hover:bg-white/[0.02] transition-colors ${
                        i === blocks.length - 1 ? "border-0" : ""
                      }`}
                    >
                      <td className="px-5 py-2.5">
                        <span
                          onClick={() =>
                            navigate(
                              `/subnets/${chainId}/blocks/${row.block_number}`,
                            )
                          }
                          className="text-blue-400 font-medium hover:text-blue-300 cursor-pointer"
                        >
                          #{row.block_number}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-gray-300">
                        {truncateHash(row.block_hash)}
                      </td>
                      <td className="px-3 py-2.5 text-gray-300">
                        {row.block_status ?? "—"}
                      </td>
                      <td className="px-3 py-2.5 font-semibold text-gray-200">
                        {Array.isArray(row.transactions)
                          ? row.transactions.length
                          : 0}
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
