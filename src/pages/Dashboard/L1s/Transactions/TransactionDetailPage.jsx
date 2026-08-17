import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import { ArrowLeft } from "@phosphor-icons/react";
import Navbar from "../../DashboardComponent/Navbar";
import ClipBoardComponet from "../../../../components/Pagination/ClipBoard";
import StatusBadge from "./StatusBadge";

dayjs.extend(utc);
dayjs.extend(relativeTime);

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const getBlockNumberFromRef = (block = "") => {
  const parts = block.split("-");
  return parts[parts.length - 1];
};

const fmtFee = (gasUsed, gasPrice) => {
  const used = Number(gasUsed);
  const price = Number(gasPrice);
  if (!used || !price) return "—";
  return `${(used * price) / 1e18}`;
};

const CopyableValue = ({ value, onClick }) => (
  <div className="flex items-center gap-1.5 min-w-0">
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
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-gray-800/60 last:border-b-0">
    <span className="text-xs text-gray-500 flex-shrink-0">{label}</span>
    <span className="text-xs font-medium text-gray-200 text-right min-w-0">
      {value}
    </span>
  </div>
);

const InputDataSection = ({ transaction }) => {
  const [viewType, setViewType] = useState("default");
  const [open, setOpen] = useState(false);

  if (!transaction?.input) {
    return null;
  }

  return (
    <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-800/60 flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
          Input Data
        </span>

        <div className="relative">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="text-[11px] font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300"
          >
            View Input As
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-[150px] rounded-md border border-gray-800 bg-[#111827] shadow-md z-20 overflow-hidden">
              <button
                onClick={() => {
                  setViewType("default");
                  setOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs hover:bg-[#1F2937] ${
                  viewType === "default"
                    ? "text-blue-400 font-semibold"
                    : "text-gray-300"
                }`}
              >
                Default View
              </button>

              <button
                onClick={() => {
                  setViewType("original");
                  setOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs hover:bg-[#1F2937] ${
                  viewType === "original"
                    ? "text-blue-400 font-semibold"
                    : "text-gray-300"
                }`}
              >
                Original
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-3">
        <textarea
          rows="5"
          readOnly
          disabled
          value={
            viewType === "default"
              ? `Function: ${transaction?.function_name || "N/A"}\n\nArguments:\n${JSON.stringify(
                  transaction?.function_args,
                  null,
                  2,
                )}`
              : transaction?.input || ""
          }
          className="block w-full rounded-lg border border-gray-800 bg-[#060B15] p-2.5 font-mono text-sm text-gray-300"
        />
      </div>
    </div>
  );
};

const LogEntry = ({ log }) => {
  const [showData, setShowData] = useState(false);
  const topics = Array.isArray(log.topics) ? log.topics : [];

  return (
    <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-gray-800/60 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-2 py-0.5 rounded bg-[#111827] border border-gray-800 text-[10px] font-bold text-gray-400 flex-shrink-0">
            LOG #{log.log_index}
          </span>
          <span className="text-xs font-mono text-gray-300 truncate">
            {log.address}
          </span>
          <ClipBoardComponet val={log.address} message="Address copied!" />
        </div>
        <span className="text-[11px] text-gray-600 flex-shrink-0">
          {log.timestamp ? dayjs(Number(log.timestamp)).fromNow() : "—"}
        </span>
      </div>

      {topics.length > 0 && (
        <div className="px-5 py-3 space-y-1.5 border-b border-gray-800/60">
          {topics.map((topic, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[10px] font-bold text-gray-600 mt-0.5 flex-shrink-0 w-14">
                Topic {i}
              </span>
              <span className="text-xs font-mono text-gray-400 break-all">
                {topic}
              </span>
              <ClipBoardComponet val={topic} message="Topic copied!" />
            </div>
          ))}
        </div>
      )}

      <div className="px-5 py-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-gray-600">DATA</span>
          {log.data && log.data !== "0x" && (
            <button
              onClick={() => setShowData((v) => !v)}
              className="text-[10px] font-bold uppercase text-blue-400 hover:text-blue-300"
            >
              {showData ? "Hide" : "Show"}
            </button>
          )}
        </div>
        {!log.data || log.data === "0x" ? (
          <span className="text-xs text-gray-700">—</span>
        ) : showData ? (
          <p className="text-xs font-mono text-gray-400 break-all">
            {log.data}
          </p>
        ) : null}
      </div>
    </div>
  );
};

const TABS = ["Details", "Logs"];

export default function TransactionDetailPage() {
  const { chainId, txHash } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    orbitTransactionDetail,
    orbitTransactionDetailLoading,
    transactionLogs,
    transactionLogsLoading,
  } = useSelector((s) => s.orbit);
  const [tab, setTab] = useState("Details");

  useEffect(() => {
    if (chainId && txHash) {
      dispatch.orbit.handleGetOrbitTransaction({ chainId, id: txHash });
      dispatch.orbit.handleGetTransactionLogs({ chainId, txHash });
    }
  }, [dispatch, chainId, txHash]);

  const tx = orbitTransactionDetail;
  const logs = transactionLogs ?? [];
  const blockNumber = tx?.block ? getBlockNumberFromRef(tx?.block) : null;
  const isContractCreation = !tx?.to || tx?.to?.toLowerCase() === ZERO_ADDRESS;

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
            onClick={() => navigate(`/orbit/${chainId}/transactions`)}
            className="text-blue-400 hover:text-blue-300 cursor-pointer"
          >
            Transactions
          </span>
          <span>/</span>
          <span className="text-gray-300 truncate max-w-[220px]">{txHash}</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white">Transaction</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xs font-mono text-gray-400 break-all">
              {txHash}
            </span>
            <ClipBoardComponet val={txHash} message="Hash copied!" />
          </div>
        </div>

        <div className="flex items-center gap-0 border-b border-gray-800/60">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === t
                  ? "text-white border-blue-500"
                  : "text-gray-500 border-transparent hover:text-gray-300"
              }`}
            >
              {t === "Logs" ? `Logs (${logs.length})` : t}
            </button>
          ))}
        </div>

        {tab === "Logs" ? (
          transactionLogsLoading && logs.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-600 text-sm">
              Loading logs…
            </div>
          ) : logs.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-600 text-sm">
              No logs emitted by this transaction
            </div>
          ) : (
            <div className="space-y-2.5">
              {logs?.map((log) => (
                <LogEntry key={log.id} log={log} />
              ))}
            </div>
          )
        ) : orbitTransactionDetailLoading && !tx ? (
          <div className="h-64 flex items-center justify-center text-gray-600 text-sm">
            Loading transaction…
          </div>
        ) : !tx ? (
          <div className="h-64 flex items-center justify-center text-gray-600 text-sm">
            Transaction not found
          </div>
        ) : (
          <>
            {/* Overview */}
            <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
              <InfoRow
                label="Status"
                value={<StatusBadge status={tx.transaction_status} />}
              />
              <InfoRow
                label="Method"
                value={
                  tx.function_name ? (
                    <span className="px-2 py-0.5 rounded bg-[#111827] border border-gray-800 text-[11px] font-mono text-gray-300">
                      {tx.function_name}
                    </span>
                  ) : (
                    "—"
                  )
                }
              />
              <InfoRow
                label="Block"
                value={
                  blockNumber ? (
                    <span
                      onClick={() =>
                        navigate(`/orbit/${chainId}/blocks/${blockNumber}`)
                      }
                      className="text-blue-400 hover:text-blue-300 cursor-pointer font-mono"
                    >
                      #{blockNumber}
                    </span>
                  ) : (
                    "—"
                  )
                }
              />
              <InfoRow label="Chain" value={tx.chain_name ?? chainId} />
              <InfoRow
                label="Timestamp"
                value={
                  tx.timestamp
                    ? `${dayjs(Number(tx.timestamp)).fromNow()} (${dayjs(
                        Number(tx.timestamp),
                      ).format("MMM D, YYYY, h:mm:ss A")})`
                    : "—"
                }
              />
              <InfoRow label="Nonce" value={tx.nonce ?? "—"} />
              <InfoRow
                label="Type"
                value={`${tx.transaction_type ?? "—"}${
                  tx.type != null ? ` (type ${tx.type})` : ""
                }`}
              />
            </div>

            {/* Value & Fees */}
            <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
              <InfoRow label="Value" value={`${tx.value ?? "0"} RYT`} />
              {/* <InfoRow label="Gas Limit" value={tx.gas ?? "—"} /> */}
              {/* <InfoRow label="Gas Used" value={tx.gas_used ?? "—"} /> */}
              {/* <InfoRow label="Gas Price" value={tx.gas_price ?? "—"} /> */}
              <InfoRow
                label="Transaction Fee"
                value={fmtFee(tx.gas_used, tx.gas_price)}
              />
            </div>

            {/* Transfer */}
            <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-gray-800/60">
                <span className="text-xs text-gray-500 flex-shrink-0">
                  From
                </span>
                <CopyableValue
                  value={tx.from}
                  onClick={() =>
                    tx.from && navigate(`/orbit/${chainId}/address/${tx.from}`)
                  }
                />
              </div>
              <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-gray-800/60 last:border-b-0">
                <span className="text-xs text-gray-500 flex-shrink-0">To</span>
                {isContractCreation ? (
                  <span className="text-xs font-mono text-gray-200">
                    Contract Creation
                  </span>
                ) : (
                  <CopyableValue
                    value={tx.to}
                    onClick={() =>
                      tx.to && navigate(`/orbit/${chainId}/address/${tx.to}`)
                    }
                  />
                )}
              </div>
              {tx.contract_address &&
                tx.contract_address.toLowerCase() !== ZERO_ADDRESS && (
                  <div className="flex items-center justify-between gap-4 px-5 py-3 border-t border-gray-800/60">
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      Contract
                    </span>
                    <CopyableValue
                      value={tx.contract_address}
                      onClick={() =>
                        navigate(
                          `/orbit/${chainId}/address/${tx.contract_address}`,
                        )
                      }
                    />{" "}
                  </div>
                )}
            </div>

            <InputDataSection transaction={tx} />
          </>
        )}
      </div>
    </div>
  );
}
