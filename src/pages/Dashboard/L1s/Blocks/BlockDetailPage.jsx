import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import { ArrowLeft, CaretLeft, CaretRight } from "@phosphor-icons/react";
import Navbar from "../../DashboardComponent/Navbar";
import ClipBoardComponet from "../../../../components/Pagination/ClipBoard";

dayjs.extend(utc);
dayjs.extend(relativeTime);

const STATUS_MAP = {
  finalized: { bg: "rgba(34,197,94,0.12)", color: "#22c55e" },
  pending: { bg: "rgba(245,158,11,0.12)", color: "#f59e0b" },
};

const getStatusStyle = (status = "") =>
  STATUS_MAP[status.toLowerCase()] ?? { bg: "rgba(148,163,184,0.12)", color: "#94a3b8" };

const HashRow = ({ label, value, onClick }) => (
  <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-gray-800/60 last:border-b-0">
    <span className="text-xs text-gray-500 flex-shrink-0">{label}</span>
    <div className="flex items-center gap-1.5 min-w-0">
      {value ? (
        <>
          <span
            onClick={onClick}
            className={`text-xs font-mono text-gray-200 truncate ${
              onClick ? "text-blue-400 hover:text-blue-300 cursor-pointer" : ""
            }`}
            title={value}
          >
            {value}
          </span>
          <ClipBoardComponet val={value} message="Copied!" />
        </>
      ) : (
        <span className="text-xs text-gray-600">—</span>
      )}
    </div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-gray-800/60 last:border-b-0">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="text-xs font-medium text-gray-200 text-right">
      {value}
    </span>
  </div>
);

export default function BlockDetailPage() {
  const { chainId, blockNumber } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orbitBlockDetail, orbitBlockDetailLoading } = useSelector(
    (s) => s.orbit,
  );

  useEffect(() => {
    if (chainId && blockNumber) {
      dispatch.orbit.handleGetOrbitBlock({ chainId, id: blockNumber });
    }
  }, [dispatch, chainId, blockNumber]);

  const block = orbitBlockDetail;
  const num = Number(blockNumber);
  const statusStyle = getStatusStyle(block?.block_status);
  const txHashes = Array.isArray(block?.transactions) ? block.transactions : [];

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
          <span>Chain {chainId}</span>
          <span>/</span>
          <span
            onClick={() => navigate(`/subnets/${chainId}/blocks`)}
            className="text-blue-400 hover:text-blue-300 cursor-pointer"
          >
            Blocks
          </span>
          <span>/</span>
          <span className="text-gray-300">#{blockNumber}</span>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            Block <span className="text-gray-500">#{blockNumber}</span>
          </h1>
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                navigate(`/subnets/${chainId}/blocks/${num - 1}`)
              }
              disabled={num <= 0}
              className="p-1.5 rounded-md border border-gray-800 bg-[#0B111D] text-gray-500 disabled:opacity-30 hover:border-gray-700 hover:text-gray-300 transition-colors"
            >
              <CaretLeft size={13} />
            </button>
            <button
              onClick={() =>
                navigate(`/subnets/${chainId}/blocks/${num + 1}`)
              }
              className="p-1.5 rounded-md border border-gray-800 bg-[#0B111D] text-gray-500 hover:border-gray-700 hover:text-gray-300 transition-colors"
            >
              <CaretRight size={13} />
            </button>
          </div>
        </div>

        {orbitBlockDetailLoading && !block ? (
          <div className="h-64 flex items-center justify-center text-gray-600 text-sm">
            Loading block…
          </div>
        ) : !block ? (
          <div className="h-64 flex items-center justify-center text-gray-600 text-sm">
            Block not found
          </div>
        ) : (
          <>
            {/* Overview */}
            <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
              <InfoRow
                label="Status"
                value={
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider"
                    style={{ background: statusStyle.bg, color: statusStyle.color }}
                  >
                    {block.block_status ?? "—"}
                  </span>
                }
              />
              <InfoRow
                label="Timestamp"
                value={
                  block.timestamp
                    ? `${dayjs(Number(block.timestamp)).fromNow()} (${dayjs(
                        Number(block.timestamp),
                      ).format("MMM D, YYYY, h:mm:ss A")})`
                    : "—"
                }
              />
              <InfoRow label="Chain" value={block.chain_name ?? chainId} />
              <InfoRow
                label="Transactions"
                value={`${txHashes.length} transaction${txHashes.length === 1 ? "" : "s"}`}
              />
              <InfoRow label="Block Reward" value={block.block_reward || "—"} />
              <InfoRow label="Value" value={block.value || "—"} />
            </div>

            {/* Hashes */}
            <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
              <HashRow label="Block Hash" value={block.block_hash} />
              <HashRow
                label="Previous Hash"
                value={block.previous_hash}
                onClick={() =>
                  num > 0 &&
                  navigate(`/subnets/${chainId}/blocks/${num - 1}`)
                }
              />
              <HashRow label="State Root" value={block.state_root} />
              <HashRow label="Transaction Root" value={block.transaction_root} />
              <HashRow label="Receipt Root" value={block.reciept_root} />
            </div>

            {/* Transactions */}
            {txHashes.length > 0 && (
              <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-800">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                    Transactions in this block
                  </span>
                </div>
                {txHashes.map((hash) => (
                  <div
                    key={hash}
                    className="flex items-center gap-1.5 px-5 py-2.5 border-b border-gray-800/40 last:border-0"
                  >
                    <span className="text-xs font-mono text-blue-400 truncate">
                      {hash}
                    </span>
                    <ClipBoardComponet val={hash} message="Hash copied!" />
                  </div>
                ))}
              </div>
            )}

            {/* Raw data */}
            {block.data && (
              <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-800">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                    Input Data
                  </span>
                </div>
                <div className="px-5 py-3">
                  <p className="text-xs font-mono text-gray-400 break-all">
                    {block.data}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
