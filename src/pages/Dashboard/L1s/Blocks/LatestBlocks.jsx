import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import ClipBoardComponet from "../../../../components/Pagination/ClipBoard";

dayjs.extend(utc);
dayjs.extend(relativeTime);

const truncateHash = (hash = "") =>
  hash.length > 14 ? `${hash?.slice(0, 8)}…${hash.slice(-6)}` : hash;

export default function LatestBlocks({ chainId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orbitBlocks, orbitBlocksLoading } = useSelector((s) => s.orbit);

  useEffect(() => {
    if (chainId) {
      dispatch.orbit.handleGetOrbitBlocks({ chainId, lastId: "0", limit: "3" });
    }
  }, [dispatch, chainId]);

  const blocks = orbitBlocks ?? [];

  return (
    <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
        <span className="text-sm font-semibold text-white">Latest Blocks</span>
        <button
          onClick={() => navigate(`/subnets/${chainId}/blocks`)}
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
                Block
              </th>
              <th className="text-left px-3 py-2.5 text-gray-500 font-medium">
                Hash
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
            {orbitBlocksLoading && blocks.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-600">
                  Loading…
                </td>
              </tr>
            ) : blocks.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-600">
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
                  <td className="px-3 py-2.5 font-mono text-gray-300 flex items-center gap-1">
                    {truncateHash(row.block_hash)}
                    <ClipBoardComponet
                      val={row.block_hash}
                      message={"Hash copied!"}
                    />
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
    </div>
  );
}
