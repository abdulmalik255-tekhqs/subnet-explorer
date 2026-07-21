import { useMemo } from "react";

// Windowed page numbers with ellipses, e.g. 1 … 4 5 [6] 7 8 … 20
const getPageNumbers = (current, total) => {
  const delta = 2;
  const pages = [];
  let last;
  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      if (last !== undefined && i - last > 1) {
        pages.push("…");
      }
      pages.push(i);
      last = i;
    }
  }
  return pages;
};

export default function Pagination({ page, totalPages, onPageChange }) {
  const pageNumbers = useMemo(
    () => getPageNumbers(page, totalPages),
    [page, totalPages],
  );

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-800/60">
      <span className="text-[11px] text-gray-600">
        Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-1">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="px-2.5 py-1 rounded-md border border-gray-800 bg-[#0B111D] text-gray-500 text-xs font-bold disabled:opacity-30 hover:border-gray-700 hover:text-gray-300 transition-colors"
        >
          ←
        </button>

        {pageNumbers.map((p, i) =>
          p === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="px-1.5 text-xs text-gray-700"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-2.5 py-1 rounded-md border text-xs font-bold transition-colors ${
                page === p
                  ? "border-blue-500/60 bg-blue-500/10 text-white"
                  : "border-gray-800 bg-[#0B111D] text-gray-500 hover:border-gray-700 hover:text-gray-300"
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          className="px-2.5 py-1 rounded-md border border-gray-800 bg-[#0B111D] text-gray-500 text-xs font-bold disabled:opacity-30 hover:border-gray-700 hover:text-gray-300 transition-colors"
        >
          →
        </button>
      </div>
    </div>
  );
}
