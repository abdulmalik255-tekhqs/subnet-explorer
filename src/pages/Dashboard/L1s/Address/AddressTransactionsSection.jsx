import { useState } from "react";
import AddressTransactionsTable from "./AddressTransactionsTable";
import AddressErc20TxsTable from "./AddressErc20TxsTable";
import AddressNftTransfersTable from "./AddressNftTransfersTable";
import AddressAssetsGrid from "./AddressAssetsGrid";

const DATA_TABS = [
  "Transactions",
  // "Internal Txns",
  "ERC20 Token Txns",
  "NFT Transfers",
  "Assets",
];

export default function AddressTransactionsSection({ chainId, address }) {
  const [dataTab, setDataTab] = useState("Transactions");

  return (
    <>
      {/* Data tabs */}
      <div className="flex items-center gap-1 bg-[#111827] border border-gray-800 rounded-lg p-1 w-fit flex-wrap">
        {DATA_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setDataTab(t)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
              dataTab === t
                ? "bg-[#1E293B] text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {dataTab === "Transactions" && (
        <AddressTransactionsTable
          chainId={chainId}
          address={address}
          active={dataTab === "Transactions"}
        />
      )}
      {dataTab === "ERC20 Token Txns" && (
        <AddressErc20TxsTable
          chainId={chainId}
          address={address}
          active={dataTab === "ERC20 Token Txns"}
        />
      )}
      {dataTab === "NFT Transfers" && (
        <AddressNftTransfersTable
          chainId={chainId}
          address={address}
          active={dataTab === "NFT Transfers"}
        />
      )}
      {dataTab === "Assets" && (
        <AddressAssetsGrid
          chainId={chainId}
          address={address}
          active={dataTab === "Assets"}
        />
      )}
      {/* {dataTab === "Internal Txns" && (
        <div className="bg-[#0B111D] border border-gray-800 rounded-xl h-40 flex items-center justify-center text-gray-600 text-sm">
          {dataTab} data isn't wired up to an API yet.
        </div>
      )} */}
    </>
  );
}
