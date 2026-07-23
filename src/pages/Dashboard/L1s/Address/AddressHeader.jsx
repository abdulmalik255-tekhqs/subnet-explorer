import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import ClipBoardComponet from "../../../../components/Pagination/ClipBoard";

export default function AddressHeader({ chainId, address, isContract }) {
  const navigate = useNavigate();

  return (
    <>
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
        <span className="text-gray-300">Address</span>
      </div>

      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl font-bold text-white break-all">{address}</h1>
          <ClipBoardComponet val={address} message="Address copied!" />
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              isContract
                ? "bg-purple-500/10 text-purple-400"
                : "bg-blue-500/10 text-blue-400"
            }`}
          >
            {isContract ? "Contract" : "EOA"}
          </span>
        </div>
      </div>
    </>
  );
}
