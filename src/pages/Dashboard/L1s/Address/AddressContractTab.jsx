import { InfoRow, Collapsible } from "./AddressAtoms";

export default function AddressContractTab({ acct }) {
  return (
    <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
      <InfoRow
        label="Verification"
        value={
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              acct.is_verified
                ? "bg-green-500/10 text-green-400"
                : "bg-gray-500/10 text-gray-400"
            }`}
          >
            {acct.is_verified ? "Verified" : "Unverified"}
          </span>
        }
      />
      <InfoRow label="Contract Name" value={acct.contract_name} />
      <InfoRow label="Compiler Version" value={acct.compiler_version} />
      <InfoRow label="License" value={acct.license} />
      <InfoRow label="EVM Version" value={acct.evm_version} />
      <InfoRow
        label="Optimizer"
        value={acct.optimizer === null ? "—" : acct.optimizer ? "Yes" : "No"}
      />
      <InfoRow
        label="Via IR"
        value={acct.via_ir === null ? "—" : acct.via_ir ? "Yes" : "No"}
      />
      <InfoRow
        label="Proxy"
        value={acct.is_proxy === null ? "—" : acct.is_proxy ? "Yes" : "No"}
      />
      {acct.is_proxy && (
        <>
          <InfoRow label="Proxy Type" value={acct.proxy_type} />
          <InfoRow label="Implementation" value={acct.implementation} />
          <InfoRow label="Admin" value={acct.admin} />
          <InfoRow label="Beacon" value={acct.beacon} />
        </>
      )}
      <Collapsible label="Constructor Args" content={acct.constructor_args} />
      <Collapsible label="ABI" content={acct.abi} />
      <Collapsible label="Source Code" content={acct.source_code} />
      <Collapsible
        label="On-chain Bytecode"
        content={acct.on_chain_bytecode}
      />
      <Collapsible label="Code Structure" content={acct.code_structure} />
    </div>
  );
}
