import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { InfoRow, CopyableValue } from "./AddressAtoms";
import { fmtNum } from "./addressUtils";

export default function AddressOverviewTab({ acct, chainId, isContract }) {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
      <InfoRow label="Chain" value={acct.chain_name ?? chainId} />
      <InfoRow label="Address Index" value={fmtNum(acct.number)} />
      <InfoRow
        label="First Seen"
        value={
          acct.timestamp || acct.deployed_timestamp
            ? dayjs(Number(acct.timestamp ?? acct.deployed_timestamp)).fromNow()
            : "—"
        }
      />
      <InfoRow
        label="Type"
        value={isContract ? "Contract" : "Externally Owned Account"}
      />
      {isContract && (
        <>
          <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-gray-800/60">
            <span className="text-xs text-gray-500 flex-shrink-0">
              Creator
            </span>
            <CopyableValue
              value={acct.creator}
              onClick={() =>
                acct.creator &&
                navigate(`/subnets/${chainId}/address/${acct.creator}`)
              }
            />
          </div>
          <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-gray-800/60 last:border-b-0">
            <span className="text-xs text-gray-500 flex-shrink-0">
              Creation Tx
            </span>
            <CopyableValue
              value={acct.creation_tx_hash}
              onClick={() =>
                acct.creation_tx_hash &&
                navigate(`/subnets/${chainId}/tx/${acct.creation_tx_hash}`)
              }
            />
          </div>
        </>
      )}
    </div>
  );
}
