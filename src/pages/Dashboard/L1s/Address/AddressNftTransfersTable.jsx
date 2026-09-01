import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Pagination from "../Pagination";
import { DirectionBadge } from "./AddressAtoms";
import { truncateHash, fmtNum } from "./addressUtils";
import useKeysetPagination, { PAGE_SIZE } from "./useKeysetPagination";
import ClipBoardComponet from "../../../../components/Pagination/ClipBoard";

export default function AddressNftTransfersTable({ chainId, address, active }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchPage = useCallback(
    async (lastId) => {
      const data = await dispatch.orbit.handleGetNftTransfers({
        chainId,
        address,
        lastId,
        limit: String(PAGE_SIZE),
      });
      return { items: data?.transfers ?? [], total: data?.totalTransfers };
    },
    [dispatch, chainId, address],
  );

  const { items, total, totalPages, page, loading, goToPage } =
    useKeysetPagination({ chainId, address, active, fetchPage });

  return (
    <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs text-gray-500">
          Latest {items.length} from a total of{" "}
          <span className="text-gray-300 font-semibold">{fmtNum(total)}</span>{" "}
          NFT transfers
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-800/60">
              <th className="text-left px-5 py-2.5 text-gray-500 font-medium">
                Tx Hash
              </th>
              <th className="text-left px-3 py-2.5 text-gray-500 font-medium">
                Token
              </th>
              <th className="text-left px-3 py-2.5 text-gray-500 font-medium">
                Type
              </th>
              <th className="text-left px-3 py-2.5 text-gray-500 font-medium">
                From
              </th>
              <th className="text-left px-3 py-2.5 text-gray-500 font-medium" />
              <th className="text-left px-3 py-2.5 text-gray-500 font-medium">
                To
              </th>
              <th className="text-right px-5 py-2.5 text-gray-500 font-medium">
                Age
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-10 text-gray-600 text-xs"
                >
                  Loading…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-10 text-gray-600 text-xs"
                >
                  No NFT transfers found
                </td>
              </tr>
            ) : (
              items.map((row, i) => {
                const isOut =
                  row.from?.toLowerCase() === address?.toLowerCase();
                const txHash = row.transaction_hash?.split("-").pop();
                return (
                  <tr
                    key={row.id ?? i}
                    className={`border-b border-gray-800/40 hover:bg-white/[0.02] transition-colors ${
                      i === items.length - 1 ? "border-0" : ""
                    }`}
                  >
                    <td className="px-5 py-2.5">
                      <span className="text-blue-400 font-mono hover:text-blue-300 cursor-pointer flex items-center gap-2">
                        <span
                          onClick={() =>
                            navigate(`/orbit/${chainId}/tx/${txHash}`)
                          }
                        >
                          {truncateHash(txHash)}
                        </span>
                        <ClipBoardComponet
                          val={txHash}
                          message="Hash copied!"
                        />
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="font-mono text-gray-300 hover:text-blue-300 cursor-pointer flex items-center gap-2">
                        <span
                          onClick={() =>
                            navigate(
                              `/orbit/${chainId}/address/${row.token_address}`,
                            )
                          }
                        >
                          {row.name || truncateHash(row.token_address)}
                        </span>
                        <ClipBoardComponet
                          val={row.token_address}
                          message="Address copied!"
                        />
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-gray-400">
                      {row.token_type ?? "—"}
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
                    <td className="px-1 py-2.5">
                      <DirectionBadge isOut={isOut} />
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
                    <td className="px-5 py-2.5 text-right text-gray-500">
                      {dayjs(Number(row.timestamp)).fromNow()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
    </div>
  );
}
