import { useState } from "react";
import ClipBoardComponet from "../../../../components/Pagination/ClipBoard";

export const StatCard = ({ label, value, accent }) => (
  <div className="relative bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
    <div className="h-[3px] w-full" style={{ backgroundColor: accent }} />
    <div className="p-4">
      <div className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-2">
        {label}
      </div>
      <div className="text-xl font-bold text-white tracking-tight truncate">
        {value}
      </div>
    </div>
  </div>
);

export const CopyableValue = ({ value, onClick }) => (
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
    {value && <ClipBoardComponet val={value} message="Copied!" />}
  </div>
);

export const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-gray-800/60 last:border-b-0">
    <span className="text-xs text-gray-500 flex-shrink-0">{label}</span>
    <span className="text-xs font-medium text-gray-200 text-right min-w-0">
      {value ?? "—"}
    </span>
  </div>
);

export const DirectionBadge = ({ isOut }) => (
  <span
    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
      isOut ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400"
    }`}
  >
    {isOut ? "OUT" : "IN"}
  </span>
);

export const Collapsible = ({ label, content }) => {
  const [open, setOpen] = useState(false);
  if (!content) return null;
  return (
    <div className="border-b border-gray-800/60 last:border-b-0">
      <div className="flex items-center justify-between px-5 py-3">
        <span className="text-xs text-gray-500">{label}</span>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-[11px] font-bold uppercase text-blue-400 hover:text-blue-300"
        >
          {open ? "Hide" : "Show"}
        </button>
      </div>
      {open && (
        <div className="px-5 pb-3">
          <p className="text-xs font-mono text-gray-400 break-all whitespace-pre-wrap">
            {typeof content === "string"
              ? content
              : JSON.stringify(content, null, 2)}
          </p>
        </div>
      )}
    </div>
  );
};
