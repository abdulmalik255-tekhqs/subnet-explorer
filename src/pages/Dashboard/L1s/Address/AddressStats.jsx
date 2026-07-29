import { StatCard } from "./AddressAtoms";
import { fmtNum, roundToSixDecimals } from "./addressUtils";

export default function AddressStats({ acct, addressBalance }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
      <StatCard
        label="Balance"
        value={
          addressBalance != null && addressBalance !== undefined
            ? `${roundToSixDecimals(Number(addressBalance))} RYT`
            : "0"
        }
        accent="#3b82f6"
      />
      <StatCard
        label="Total Transactions"
        value={fmtNum(acct.total_transactions)}
        accent="#22c55e"
      />
      <StatCard
        label="Total Events"
        value={fmtNum(acct.total_events)}
        accent="#f59e0b"
      />
      <StatCard
        label="Token Transfers"
        value={`${fmtNum(acct.total_erc20_transfers)} ERC20 · ${fmtNum(
          acct.total_nft_transfers,
        )} NFT`}
        accent="#2dd4a7"
      />
    </div>
  );
}
