import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { formatTokenAmount, shortenString } from "../../../utils";
import ClipBoardComponet from "../../../components/Pagination/ClipBoard";

dayjs.extend(relativeTime);

const POLL_INTERVAL_MS = 2000;
const MAX_ITEMS = 5;

const TYPE_DOT_COLORS = {
  Transfer: "#3B82F6",
  Swap: "#3B82F6",
  "Contract Interaction": "#8B5CF6",
  "Contract Deploy": "#8B5CF6",
  "Token Mint": "#F59E0B",
};

export default function LiveActivity() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { globalTransactions } = useSelector((s) => s.orbit);

  useEffect(() => {
    dispatch.orbit.handleGetGlobalTransactions({ limit: String(MAX_ITEMS) });
    const intervalId = setInterval(() => {
      dispatch.orbit.handleGetGlobalTransactions({ limit: String(MAX_ITEMS) });
    }, POLL_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [dispatch]);

  const items = (globalTransactions ?? [])?.slice(0, MAX_ITEMS);
  return (
    <div className="bg-[#0B1220] border border-gray-800/60 rounded-2xl p-4 shadow-2xl shadow-black/50 w-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] text-blue-400/80 font-bold uppercase tracking-widest">
          Live Activity
        </span>
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-green-500/30 bg-green-500/10 text-[10px] font-bold text-green-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          LIVE
        </span>
      </div>

      {items.length === 0 ? (
        <div className="h-[180px] flex items-center justify-center">
          <span className="text-xs text-gray-600 font-medium">
            No recent activity
          </span>
        </div>
      ) : (
        <div className="flex flex-col">
          {items?.map((tx) => (
            <div
              key={tx?.id}
              className="flex items-center gap-3 py-2.5 border-b border-gray-800/40 last:border-b-0"
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  backgroundColor:
                    TYPE_DOT_COLORS[tx.transaction_type] ?? "#6B7280",
                }}
              />
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <span className="text-sm font-mono text-blue-400 truncate flex items-center gap-1">
                  <span
                    onClick={() =>
                      navigate(`/orbit/${tx?.chain_id}/tx/${tx?.hash}`)
                    }
                    className="hover:text-blue-300 cursor-pointer"
                  >
                    {shortenString(tx?.hash)}
                  </span>

                  <ClipBoardComponet
                    val={tx?.hash}
                    message="Transaction hash copied!"
                    className="text-blue-400 hover:text-gray-200"
                  />
                </span>
                <span className="text-xs text-gray-600">
                  {tx?.transaction_type}
                  {tx?.value &&
                    tx?.value !== "0" &&
                    ` · ${formatTokenAmount(tx?.value)} RYT`}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="px-1.5 py-0.5 bg-[#1E293B] rounded text-[10px] text-gray-500 font-mono">
                  {tx?.chain_name}
                </span>
                <span className="text-[11px] text-gray-600 text-right">
                  {dayjs(Number(tx?.timestamp)).fromNow()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
