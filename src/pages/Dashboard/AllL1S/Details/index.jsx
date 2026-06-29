import React, { useState } from "react";
import { Copy, Check, Globe, ArrowSquareOut } from "@phosphor-icons/react";
import { networkContracts } from "../demoData";

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={handle} className="ml-1.5 text-gray-600 hover:text-gray-300 transition-colors flex-shrink-0">
      {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
    </button>
  );
};

const InfoRow = ({ label, value, mono = false, copiable = false, link = false }) => (
  <div className="flex items-start justify-between py-3 border-b border-gray-800/50 last:border-0">
    <span className="text-gray-500 text-xs w-44 flex-shrink-0">{label}</span>
    <div className="flex items-center min-w-0 flex-1 justify-end">
      <span className={`text-gray-200 text-xs break-all text-right ${mono ? "font-mono" : ""}`}>
        {value}
      </span>
      {copiable && <CopyButton text={String(value)} />}
      {link && (
        <a
          href={String(value)}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1.5 text-gray-600 hover:text-blue-400 transition-colors flex-shrink-0"
        >
          <ArrowSquareOut size={13} />
        </a>
      )}
    </div>
  </div>
);

const SectionCard = ({ title, icon, children }) => (
  <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
    <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-800">
      {icon && <span className="text-blue-400">{icon}</span>}
      <span className="text-sm font-semibold text-white">{title}</span>
    </div>
    <div className="px-5">{children}</div>
  </div>
);

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
    status === "Active"
      ? "bg-green-500/10 text-green-400 border border-green-500/20"
      : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
  }`}>
    <span className={`w-1.5 h-1.5 rounded-full ${status === "Active" ? "bg-green-400 animate-pulse" : "bg-gray-400"}`} />
    {status}
  </span>
);

const Details = ({ chain }) => {
  if (!chain) return null;

  return (
    <div className="px-6 py-5 space-y-4">
      {/* Overview Banner */}
      <div className="bg-[#0B111D] border border-gray-800 rounded-xl p-5 flex flex-wrap items-center gap-6">
        <div>
          <div className="text-gray-500 text-xs mb-1">Network Status</div>
          <StatusBadge status={chain.status} />
        </div>
        <div className="h-8 w-px bg-gray-800 hidden sm:block" />
        <div>
          <div className="text-gray-500 text-xs mb-1">Chain ID</div>
          <div className="text-white text-sm font-mono font-semibold">{chain.chainId}</div>
        </div>
        <div className="h-8 w-px bg-gray-800 hidden sm:block" />
        <div>
          <div className="text-gray-500 text-xs mb-1">Native Currency</div>
          <div className="text-white text-sm font-semibold">{chain.nativeCurrency?.name} ({chain.symbol})</div>
        </div>
        <div className="h-8 w-px bg-gray-800 hidden sm:block" />
        <div>
          <div className="text-gray-500 text-xs mb-1">Consensus</div>
          <div className="text-white text-sm">{chain.consensus}</div>
        </div>
        <div className="h-8 w-px bg-gray-800 hidden sm:block" />
        <div>
          <div className="text-gray-500 text-xs mb-1">Parent Subnet</div>
          <div className="text-blue-400 text-sm">{chain.subnet}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Chain Configuration */}
        <SectionCard title="Chain Configuration">
          <InfoRow label="Chain Name" value={chain.name} />
          <InfoRow label="Chain ID" value={chain.chainId} mono copiable />
          <InfoRow label="EVM Version" value={chain.evmVersion} />
          <InfoRow label="Block Gas Limit" value={chain.gasLimit} mono />
          <InfoRow label="Block Gas Target" value={chain.blockGasTarget} mono />
          <InfoRow label="Min Base Fee (wei)" value={chain.minBaseFee} mono />
          <InfoRow label="Is EVM Compatible" value={chain.isEVM ? "Yes" : "No"} />
        </SectionCard>

        {/* Network Endpoints */}
        <SectionCard title="Network Endpoints" icon={<Globe size={15} />}>
          <InfoRow label="RPC URL" value={chain.rpcUrl} mono copiable link />
          <InfoRow label="WebSocket URL" value={chain.wsUrl} mono copiable />
          <InfoRow label="Explorer URL" value={chain.explorerUrl} mono copiable link />
        </SectionCard>

        {/* Native Currency */}
        <SectionCard title="Native Currency">
          <InfoRow label="Name" value={chain.nativeCurrency?.name} />
          <InfoRow label="Symbol" value={chain.symbol} />
          <InfoRow label="Decimals" value={chain.nativeCurrency?.decimals} />
        </SectionCard>

        {/* Security & Consensus */}
        <SectionCard title="Security & Consensus">
          <InfoRow label="Consensus Protocol" value={chain.consensus} />
          <InfoRow label="Active Validators" value={chain.activeValidators} />
          <InfoRow label="Parent Subnet" value={chain.subnet} />
          <InfoRow label="Network Type" value="Layer 1 (L1)" />
        </SectionCard>
      </div>

      {/* Network Contracts */}
      <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800">
          <span className="text-sm font-semibold text-white">Network Contracts & Precompiles</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-800/60">
                <th className="text-left px-5 py-2.5 text-gray-500 font-medium">Name</th>
                <th className="text-left px-4 py-2.5 text-gray-500 font-medium">Address</th>
                <th className="text-left px-5 py-2.5 text-gray-500 font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              {networkContracts.map((c, i) => (
                <tr key={c.name} className={`border-b border-gray-800/40 hover:bg-white/[0.02] transition-colors ${i === networkContracts.length - 1 ? "border-0" : ""}`}>
                  <td className="px-5 py-3 text-gray-200">{c.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-blue-400 font-mono">{c.address}</span>
                      <CopyButton text={c.address} />
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      c.type === "Precompile"
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}>
                      {c.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Details;
