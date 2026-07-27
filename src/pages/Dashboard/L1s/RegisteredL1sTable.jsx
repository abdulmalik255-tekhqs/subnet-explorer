import { useState, useMemo, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MagnifyingGlass, CaretDown, X } from "@phosphor-icons/react";
import L1DetailPanel from "./L1DetailPanel";

const PAGE_SIZE = 6;

// cspell:disable-next-line
const TNUM = { fontVariantNumeric: "tabular-nums" };

const CHAIN_COLORS = [
  "#3b82f6",
  "#2dd4a7",
  "#f59e0b",
  "#22c55e",
  "#a855f7",
  "#ef4444",
];

const STATUS_MAP = {
  active: {
    bg: "rgba(34,197,94,0.12)",
    color: "#22c55e",
    dot: "#22c55e",
    label: "Active",
  },
  running: {
    bg: "rgba(34,197,94,0.12)",
    color: "#22c55e",
    dot: "#22c55e",
    label: "Active",
  },
  syncing: {
    bg: "rgba(245,158,11,0.12)",
    color: "#f59e0b",
    dot: "#f59e0b",
    label: "Syncing",
  },
  offline: {
    bg: "rgba(239,68,68,0.12)",
    color: "#ef4444",
    dot: "#ef4444",
    label: "Offline",
  },
};

const getStatus = (raw = "") =>
  STATUS_MAP[raw.toLowerCase()] ?? STATUS_MAP.offline;

const fmtNum = (val) => {
  if (!val || val === "0") return "–";
  const n = parseInt(val, 10);
  if (isNaN(n)) return val;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString();
};

const fmtContracts = (val) => {
  if (!val || val === "0") return "–";
  const n = parseInt(val, 10);
  return isNaN(n) ? val : n.toLocaleString();
};

const truncateId = (id = "") => (id.length > 10 ? `${id.slice(0, 10)}…` : id);

const SORT_OPTIONS = ["TPS", "Name", "Transactions", "Contracts"];
const STATUS_OPTIONS = ["All", "Active", "Running", "Offline"];

const DropMenu = ({ label, value, options, onSelect }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-500/60 bg-[#0B111D] text-blue-400 text-xs font-semibold hover:border-blue-400 transition-colors"
      >
        {label}: <span className="text-white">{value}</span>
        <CaretDown
          size={11}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-36 bg-[#0F172A] border border-gray-800 rounded-xl overflow-hidden shadow-2xl z-50">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onSelect(opt);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-xs transition-colors hover:bg-[#1E293B] ${
                value === opt ? "text-white bg-[#1E293B]" : "text-gray-400"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const SkeletonRow = () => (
  <tr className="border-b border-gray-800/40">
    {Array.from({ length: 7 }).map((_, i) => (
      <td key={i} className="px-5 py-3">
        <div className="h-3.5 bg-gray-800 animate-pulse rounded w-3/4 mx-auto" />
      </td>
    ))}
  </tr>
);

export default function RegisteredL1sTable() {
  const dispatch = useDispatch();
  const { registeredOrbits, registeredOrbitsLoading, totalOrbits } =
    useSelector((s) => s.orbit);

  const [search, setSearch] = useState("");
  // const [sortBy, setSortBy] = useState("TPS");
  // const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [selectedChain, setSelectedChain] = useState(null);

  useEffect(() => {
    dispatch.orbit.handleGetOrbits();
  }, [dispatch]);

  const filtered = useMemo(() => {
    let list = [...registeredOrbits];

    // if (statusFilter !== "All") {
    //   list = list.filter(
    //     (c) => c.status?.toLowerCase() === statusFilter.toLowerCase(),
    //   );
    // }

    // list.sort((a, b) => {
    //   if (sortBy === "TPS")
    //     return parseFloat(b.tps || 0) - parseFloat(a.tps || 0);
    //   if (sortBy === "Name") return (a.name || "").localeCompare(b.name || "");
    //   if (sortBy === "Transactions")
    //     return (
    //       parseInt(b.transaction_count || 0) -
    //       parseInt(a.transaction_count || 0)
    //     );
    //   if (sortBy === "Contracts")
    //     return (
    //       parseInt(b.total_deployed_contracts || 0) -
    //       parseInt(a.total_deployed_contracts || 0)
    //     );
    //   return 0;
    // });

    return list;
  }, [registeredOrbits, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  console.log("RegisteredL1sTable pageData:", pageData);
  // const handleSort = (v) => {
  //   setSortBy(v);
  //   setPage(1);
  // };
  // const handleStatus = (v) => {
  //   setStatusFilter(v);
  //   setPage(1);
  // };

  const showingStart = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingEnd = Math.min(page * PAGE_SIZE, filtered.length);
  useEffect(() => {
    const q = search.trim();

    const timer = setTimeout(() => {
      if (q) {
        dispatch.orbit.handleSearchOrbits({
          input: q.toLowerCase(),
        });
      } else {
        dispatch.orbit.handleGetOrbits();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, dispatch]);

  const handleClearSearch = () => {
    setSearch("");
    setPage(1);
  };
  return (
    <>
      {/* Section label */}
      <div className="flex items-center gap-4 mb-1 opacity-60">
        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">
          All Registered Orbits
        </h2>
        <div className="h-px w-full bg-gradient-to-r from-gray-800 to-transparent" />
      </div>

      <div className="bg-[#111827] border border-gray-800/60 rounded-2xl shadow-2xl shadow-black/50 w-full mb-2 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800/60">
          {/* Search */}
          <div className="relative flex items-center">
            <MagnifyingGlass
              size={13}
              className="absolute left-3 text-gray-600"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name or chain ID..."
              className="bg-[#0B111D] border border-gray-800 rounded-lg pl-8 pr-7 py-1.5 text-xs text-gray-300 placeholder-gray-700 focus:outline-none focus:border-blue-500/50 w-52 transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search"
                className="absolute right-2 text-gray-600 hover:text-gray-300 transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          {/* <DropMenu
            label="Sort"
            value={sortBy}
            options={SORT_OPTIONS}
            onSelect={handleSort}
          /> */}

          {/* Status dropdown */}
          {/* <DropMenu
            label="Status"
            value={statusFilter}
            options={STATUS_OPTIONS}
            onSelect={handleStatus}
          /> */}

          {/* Total count */}
          <span className="ml-auto text-xs font-semibold text-gray-500">
            {registeredOrbitsLoading ? "—" : `${totalOrbits} Orbit`}
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-800/60 bg-[#0B111D]">
                {[
                  { label: "Name", align: "left", pl: "pl-5" },
                  { label: "Orbit ID", align: "left", pl: "pl-4" },
                  { label: "TPS", align: "right", pl: "" },
                  { label: "Daily Txns", align: "right", pl: "" },
                  { label: "Active Addresses", align: "right", pl: "" },
                  { label: "Contracts", align: "right", pl: "" },
                  { label: "Status", align: "right", pl: "" },
                ].map(({ label, align, pl }) => (
                  <th
                    key={label}
                    className={`py-2.5 px-4 ${pl} text-[10px] font-bold tracking-widest uppercase text-gray-600 text-${align}`}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {registeredOrbitsLoading ? (
                Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))
              ) : pageData?.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-10 text-gray-600 text-xs"
                  >
                    No Orbit found
                  </td>
                </tr>
              ) : (
                pageData?.map((chain, i) => {
                  const color =
                    CHAIN_COLORS[
                      registeredOrbits?.indexOf(chain) % CHAIN_COLORS?.length
                    ];
                  const st = getStatus(chain?.status);
                  const tps = parseFloat(chain?.tps || 0);

                  const isSelected =
                    selectedChain?.chain_id === chain?.chain_id;

                  return (
                    <tr
                      key={chain?.chain_id ?? i}
                      onClick={() =>
                        setSelectedChain((prev) =>
                          prev?.chain_id === chain?.chain_id ? null : chain,
                        )
                      }
                      className={`border-b border-gray-800/30 hover:bg-white/[0.02] transition-colors cursor-pointer ${
                        isSelected ? "bg-blue-500/[0.06]" : ""
                      }`}
                    >
                      {/* Name */}
                      <td className="px-5 py-3 text-left whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <span className="font-semibold text-gray-100">
                            {chain?.name}
                          </span>
                        </div>
                      </td>

                      {/* Subnet ID */}
                      <td className="px-4 py-3 text-left">
                        <span className="text-blue-400 font-mono hover:text-blue-300 transition-colors">
                          {truncateId(chain?.orbit_id)}
                        </span>
                      </td>

                      {/* TPS */}
                      <td style={TNUM} className="px-4 py-3 text-right">
                        <span
                          className={
                            tps === 0 ? "text-gray-700" : "text-gray-200"
                          }
                        >
                          {tps === 0 ? "0" : tps?.toLocaleString()}
                        </span>
                      </td>

                      {/* Daily Txns */}
                      <td
                        style={TNUM}
                        className="px-4 py-3 text-right text-gray-300"
                      >
                        {fmtNum(chain?.transaction_count)}
                      </td>

                      {/* Active Addrs */}
                      <td
                        style={TNUM}
                        className="px-4 py-3 text-right text-gray-300"
                      >
                        {fmtNum(chain?.address_count)}
                      </td>

                      {/* Contracts */}
                      <td
                        style={TNUM}
                        className="px-4 py-3 text-right text-gray-300"
                      >
                        {fmtContracts(chain?.total_deployed_contracts)}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3 text-right">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider"
                          style={{ background: st.bg, color: st.color }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: st.dot }}
                          />
                          {chain?.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-800/60">
          <span className="text-[11px] text-gray-600">
            {filtered?.length === 0
              ? "No results"
              : `Showing ${showingStart}–${showingEnd} of ${filtered?.length}`}
          </span>

          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-2.5 py-1 rounded-md border border-gray-800 bg-[#0B111D] text-gray-500 text-xs font-bold disabled:opacity-30 hover:border-gray-700 hover:text-gray-300 transition-colors"
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-2.5 py-1 rounded-md border text-xs font-bold transition-colors ${
                  page === p
                    ? "border-blue-500/60 bg-blue-500/10 text-white"
                    : "border-gray-800 bg-[#0B111D] text-gray-500 hover:border-gray-700 hover:text-gray-300"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-2.5 py-1 rounded-md border border-gray-800 bg-[#0B111D] text-gray-500 text-xs font-bold disabled:opacity-30 hover:border-gray-700 hover:text-gray-300 transition-colors"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {selectedChain && (
        <L1DetailPanel
          chain={selectedChain}
          onClose={() => setSelectedChain(null)}
        />
      )}
    </>
  );
}
