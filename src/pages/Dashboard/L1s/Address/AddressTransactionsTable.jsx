import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import StatusBadge from "../Transactions/StatusBadge";
import Pagination from "../Pagination";
import { DirectionBadge } from "./AddressAtoms";
import { truncateHash, truncateMethod, fmtNum } from "./addressUtils";
import useKeysetPagination, { PAGE_SIZE } from "./useKeysetPagination";

export default function AddressTransactionsTable({ chainId, address, active }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchPage = useCallback(
    async (lastId) => {
      const data = await dispatch.orbit.handleGetTransactionsByAddress({
        chainId,
        address,
        lastId,
        limit: String(PAGE_SIZE),
      });
      return { items: data?.transactions ?? [], total: data?.totalTransactions };
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
          transactions
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
                Method
              </th>
              <th className="text-left px-3 py-2.5 text-gray-500 font-medium">
                Block
              </th>
              <th className="text-left px-3 py-2.5 text-gray-500 font-medium">
                From
              </th>
              <th className="text-left px-3 py-2.5 text-gray-500 font-medium" />
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
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-10 text-gray-600 text-xs">
                  Loading…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-10 text-gray-600 text-xs">
                  No transactions found
                </td>
              </tr>
            ) : (
              items.map((row, i) => {
                const isOut = row.from?.toLowerCase() === address?.toLowerCase();
                return (
                  <tr
                    key={row.id ?? i}
                    className={`border-b border-gray-800/40 hover:bg-white/[0.02] transition-colors ${
                      i === items.length - 1 ? "border-0" : ""
                    }`}
                  >
                    <td className="px-5 py-2.5">
                      <span
                        onClick={() =>
                          navigate(`/subnets/${chainId}/tx/${row.hash}`)
                        }
                        className="text-blue-400 font-mono hover:text-blue-300 cursor-pointer"
                      >
                        {truncateHash(row?.hash)}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      {row?.function_name ? (
                        <span className="px-2 py-0.5 rounded bg-[#111827] border border-gray-800 text-[10px] font-mono text-gray-400">
                          {truncateMethod(row?.function_name)}
                        </span>
                      ) : (
                        <span className="text-gray-600">Transfer</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        onClick={() =>
                          navigate(`/subnets/${chainId}/blocks/${row.number}`)
                        }
                        className="text-blue-400 hover:text-blue-300 cursor-pointer"
                      >
                        {row?.number}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-gray-300">
                      <span
                        onClick={() =>
                          navigate(`/subnets/${chainId}/address/${row.from}`)
                        }
                        className="hover:text-blue-300 cursor-pointer"
                      >
                        {truncateHash(row?.from)}
                      </span>
                    </td>
                    <td className="px-1 py-2.5">
                      <DirectionBadge isOut={isOut} />
                    </td>
                    <td className="px-3 py-2.5 font-mono text-gray-300">
                      <span
                        onClick={() =>
                          navigate(`/subnets/${chainId}/address/${row?.to}`)
                        }
                        className="hover:text-blue-300 cursor-pointer"
                      >
                        {truncateHash(row?.to)}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-gray-300">
                      {row.value ?? "0"}
                    </td>
                    <td className="px-3 py-2.5">
                      <StatusBadge status={row?.transaction_status} />
                    </td>
                    <td className="px-5 py-2.5 text-right text-gray-500">
                      {dayjs(Number(row?.timestamp)).fromNow()}
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
