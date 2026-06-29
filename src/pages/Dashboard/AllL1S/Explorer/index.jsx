import React from "react";
import { Info, ArrowRight, FileText } from "@phosphor-icons/react";
import { latestBlocks, latestTransactions } from "../demoData";

const AgeBadge = ({ age }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#1E293B] text-gray-300 text-xs whitespace-nowrap">
    in {age}
  </span>
);

const AddressLink = ({ addr }) => (
  <span className="text-blue-400 hover:text-blue-300 cursor-pointer font-mono text-xs">
    {addr}
  </span>
);

const Explorer = ({ chain }) => {
  const symbol = chain?.symbol || "TOKEN";

  return (
    <div className="px-6 py-5 space-y-5">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0B111D] border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-2">
            <span>Latest Block</span>
            <Info size={13} className="text-gray-600" />
          </div>
          <div className="text-3xl font-bold text-white tracking-tight">
            {(chain?.latestBlock || 0).toLocaleString()}
          </div>
          <div className="text-gray-500 text-xs mt-1">
            Average Block Time: {chain?.avgBlockTime || "—"}
          </div>
        </div>

        <div className="bg-[#0B111D] border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-2">
            <span>Total Transactions</span>
            <Info size={13} className="text-gray-600" />
          </div>
          <div className="text-3xl font-bold text-white tracking-tight">
            {(chain?.totalTransactions || 0).toLocaleString()}
          </div>
          <div className="text-gray-500 text-xs mt-1">
            {chain?.tps || 0} TPS
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Latest Blocks */}
        <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <span className="text-sm font-semibold text-white">Latest Blocks</span>
            <button className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
              View All Blocks <ArrowRight size={12} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-800/60">
                  <th className="text-left px-5 py-2.5 text-gray-500 font-medium">Block</th>
                  <th className="text-left px-3 py-2.5 text-gray-500 font-medium">Hash</th>
                  <th className="text-left px-3 py-2.5 text-gray-500 font-medium">
                    <div className="flex items-center gap-1">Age <Info size={11} className="text-gray-600" /></div>
                  </th>
                  <th className="text-left px-3 py-2.5 text-gray-500 font-medium">
                    <div className="flex items-center gap-1">Transactions <Info size={11} className="text-gray-600" /></div>
                  </th>
                  <th className="text-right px-5 py-2.5 text-gray-500 font-medium">
                    <div className="flex items-center justify-end gap-1">Fee <Info size={11} className="text-gray-600" /></div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {latestBlocks.map((row, i) => (
                  <tr
                    key={row.block}
                    className={`border-b border-gray-800/40 hover:bg-white/[0.02] transition-colors ${i === latestBlocks.length - 1 ? "border-0" : ""}`}
                  >
                    <td className="px-5 py-2.5">
                      <span className="text-blue-400 hover:text-blue-300 cursor-pointer font-medium">
                        {row.block.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <AddressLink addr={row.hash} />
                    </td>
                    <td className="px-3 py-2.5">
                      <AgeBadge age={row.age} />
                    </td>
                    <td className="px-3 py-2.5 text-gray-300">{row.txCount}</td>
                    <td className="px-5 py-2.5 text-right text-gray-300 font-mono">
                      {row.fee} {symbol}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Latest Successful Transactions */}
        <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <span className="text-sm font-semibold text-white">Latest Successful Transactions</span>
            <button className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
              View All Transactions <ArrowRight size={12} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-800/60">
                  <th className="text-left px-5 py-2.5 text-gray-500 font-medium">Tx Hash</th>
                  <th className="text-left px-3 py-2.5 text-gray-500 font-medium">From</th>
                  <th className="text-left px-3 py-2.5 text-gray-500 font-medium">To</th>
                  <th className="text-left px-3 py-2.5 text-gray-500 font-medium">
                    <div className="flex items-center gap-1">Age <Info size={11} className="text-gray-600" /></div>
                  </th>
                  <th className="text-right px-5 py-2.5 text-gray-500 font-medium">
                    <div className="flex items-center justify-end gap-1">Value Total <Info size={11} className="text-gray-600" /></div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {latestTransactions.map((row, i) => (
                  <tr
                    key={`${row.txHash}-${i}`}
                    className={`border-b border-gray-800/40 hover:bg-white/[0.02] transition-colors ${i === latestTransactions.length - 1 ? "border-0" : ""}`}
                  >
                    <td className="px-5 py-2.5">
                      <AddressLink addr={row.txHash} />
                    </td>
                    <td className="px-3 py-2.5">
                      <AddressLink addr={row.from} />
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1">
                        {row.isContract && (
                          <FileText size={11} className="text-gray-500 flex-shrink-0" />
                        )}
                        <AddressLink addr={row.to} />
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <AgeBadge age={row.age} />
                    </td>
                    <td className="px-5 py-2.5 text-right text-gray-300 font-mono">
                      {row.value} {symbol}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explorer;
