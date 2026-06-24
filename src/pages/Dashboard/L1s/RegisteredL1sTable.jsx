import { useState, useMemo } from "react";

const CHAINS = [
  {
    id: 1,
    color: "#3b82f6",
    name: "RYT Chain",
    subnet: "2oYMBNV4eN…",
    tps: 840,
    dailyTxns: "424K",
    activeAddrs: "24,840",
    contracts: "12,847",
    status: "Active",
  },
  {
    id: 2,
    color: "#2dd4a7",
    name: "DeFi L1",
    subnet: "3xKLMnPqR8…",
    tps: 320,
    dailyTxns: "192K",
    activeAddrs: "11,200",
    contracts: "4,210",
    status: "Active",
  },
  {
    id: 3,
    color: "#f59e0b",
    name: "Game L1",
    subnet: "9mDRsVwX2K…",
    tps: 180,
    dailyTxns: "84K",
    activeAddrs: "6,840",
    contracts: "1,940",
    status: "Active",
  },
  {
    id: 4,
    color: "#22c55e",
    name: "DAO L1",
    subnet: "7pQZrtYc4B…",
    tps: 94,
    dailyTxns: "40K",
    activeAddrs: "3,120",
    contracts: "890",
    status: "Syncing",
  },
  {
    id: 5,
    color: "#a855f7",
    name: "NFT L1",
    subnet: "4tWXjbNm6H…",
    tps: 47,
    dailyTxns: "18K",
    activeAddrs: "1,840",
    contracts: "420",
    status: "Active",
  },
  {
    id: 6,
    color: "#ef4444",
    name: "Legacy L1",
    subnet: "2bCVhkJq9L…",
    tps: 0,
    dailyTxns: "–",
    activeAddrs: "–",
    contracts: "47",
    status: "Offline",
  },
  {
    id: 7,
    color: "#3b82f6",
    name: "Alpha Net",
    subnet: "5rTNwXmK1P…",
    tps: 210,
    dailyTxns: "110K",
    activeAddrs: "9,400",
    contracts: "3,100",
    status: "Active",
  },
  {
    id: 8,
    color: "#2dd4a7",
    name: "Beta Chain",
    subnet: "8uLPqYcR3M…",
    tps: 130,
    dailyTxns: "62K",
    activeAddrs: "5,210",
    contracts: "1,540",
    status: "Syncing",
  },
  {
    id: 9,
    color: "#f59e0b",
    name: "Gamma L1",
    subnet: "1vQZkNbT6W…",
    tps: 67,
    dailyTxns: "31K",
    activeAddrs: "2,760",
    contracts: "710",
    status: "Active",
  },
  {
    id: 10,
    color: "#a855f7",
    name: "Delta Net",
    subnet: "6wSMtYdU9X…",
    tps: 22,
    dailyTxns: "9K",
    activeAddrs: "890",
    contracts: "180",
    status: "Active",
  },
  {
    id: 11,
    color: "#22c55e",
    name: "Epsilon L1",
    subnet: "3xRNvZeP2Q…",
    tps: 15,
    dailyTxns: "5K",
    activeAddrs: "430",
    contracts: "95",
    status: "Offline",
  },
  {
    id: 12,
    color: "#ef4444",
    name: "Zeta Chain",
    subnet: "9yTOwAfB7C…",
    tps: 0,
    dailyTxns: "–",
    activeAddrs: "–",
    contracts: "12",
    status: "Offline",
  },
  {
    id: 13,
    color: "#3b82f6",
    name: "Eta L1",
    subnet: "4zUPxBgC8D…",
    tps: 510,
    dailyTxns: "270K",
    activeAddrs: "18,200",
    contracts: "7,830",
    status: "Active",
  },
  {
    id: 14,
    color: "#2dd4a7",
    name: "Theta Net",
    subnet: "2aVQyCHd5E…",
    tps: 390,
    dailyTxns: "210K",
    activeAddrs: "14,100",
    contracts: "5,400",
    status: "Active",
  },
  {
    id: 15,
    color: "#f59e0b",
    name: "Iota L1",
    subnet: "7bWRzDIe6F…",
    tps: 260,
    dailyTxns: "130K",
    activeAddrs: "10,500",
    contracts: "3,700",
    status: "Syncing",
  },
  {
    id: 16,
    color: "#a855f7",
    name: "Kappa Net",
    subnet: "5cXSaEJf7G…",
    tps: 110,
    dailyTxns: "55K",
    activeAddrs: "4,200",
    contracts: "1,200",
    status: "Active",
  },
  {
    id: 17,
    color: "#22c55e",
    name: "Lambda L1",
    subnet: "1dYTbFKg8H…",
    tps: 75,
    dailyTxns: "37K",
    activeAddrs: "2,900",
    contracts: "830",
    status: "Active",
  },
  {
    id: 18,
    color: "#ef4444",
    name: "Mu Chain",
    subnet: "8eZUcGLh9I…",
    tps: 0,
    dailyTxns: "–",
    activeAddrs: "–",
    contracts: "23",
    status: "Offline",
  },
  {
    id: 19,
    color: "#3b82f6",
    name: "Nu L1",
    subnet: "6faVdHMi1J…",
    tps: 430,
    dailyTxns: "230K",
    activeAddrs: "16,700",
    contracts: "6,900",
    status: "Active",
  },
  {
    id: 20,
    color: "#2dd4a7",
    name: "Xi Net",
    subnet: "3gbWeINj2K…",
    tps: 190,
    dailyTxns: "95K",
    activeAddrs: "7,600",
    contracts: "2,400",
    status: "Active",
  },
  {
    id: 21,
    color: "#f59e0b",
    name: "Omicron L1",
    subnet: "9hcXfJOk3L…",
    tps: 55,
    dailyTxns: "26K",
    activeAddrs: "2,100",
    contracts: "580",
    status: "Syncing",
  },
];

const PAGE_SIZE = 6;

const STATUS_STYLES = {
  Active: {
    bg: "rgba(34,197,94,0.12)",
    color: "#22c55e",
    dot: "#22c55e",
    label: "• Active",
  },
  Syncing: {
    bg: "rgba(245,158,11,0.12)",
    color: "#f59e0b",
    dot: "#f59e0b",
    label: "◌ Syncing",
  },
  Offline: {
    bg: "rgba(239,68,68,0.12)",
    color: "#ef4444",
    dot: "#ef4444",
    label: "• Offline",
  },
};

const SORT_OPTIONS = ["TPS", "Name", "Daily Txns", "Contracts"];
const STATUS_OPTIONS = ["All", "Active", "Syncing", "Offline"];

export default function RegisteredL1sTable() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("TPS");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [sortOpen, setSortOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...CHAINS];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.subnet.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "All")
      list = list.filter((c) => c.status === statusFilter);
    list.sort((a, b) => {
      if (sortBy === "TPS") return b.tps - a.tps;
      if (sortBy === "Name") return a.name.localeCompare(b.name);
      if (sortBy === "Contracts")
        return (
          parseInt(b.contracts.replace(/,/g, "") || 0) -
          parseInt(a.contracts.replace(/,/g, "") || 0)
        );
      return 0;
    });
    return list;
  }, [search, sortBy, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (s) => {
    setSortBy(s);
    setSortOpen(false);
    setPage(1);
  };
  const handleStatus = (s) => {
    setStatusFilter(s);
    setStatusOpen(false);
    setPage(1);
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-1 opacity-60">
        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">
          All registered L1s
        </h2>
        <div className="h-[1px] w-full bg-gradient-to-r from-gray-800 to-transparent"></div>
      </div>
      <div
        className="bg-[#111827] border border-gray-800/60 rounded-2xl p-3 shadow-2xl shadow-black/50 w-full mb-2"
        onClick={() => {
          setSortOpen(false);
          setStatusOpen(false);
        }}
      >
        <div className="flex items-center gap-4 mb-1 opacity-60">
          <div className="relative flex items-center group">
            <input
              type="text"
              placeholder="Search tx, block, address..."
              className="bg-[#111827] border border-gray-700 rounded-lg pl-10 pr-16 py-1.5 text-sm w-80 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div className="text-sm font-medium text-gray-400">
            {filtered.length} L1s
          </div>
        </div>

        {/* Table */}
        <table style={s.table}>
          <thead>
            <tr>
              {[
                "NAME",
                "SUBNET ID",
                "TPS",
                "DAILY TXNS",
                "ACTIVE ADDRS",
                "CONTRACTS",
                "STATUS",
              ].map((col) => (
                <th
                  key={col}
                  style={{
                    ...s.th,
                    ...(col === "NAME"
                      ? { textAlign: "left", paddingLeft: 36 }
                      : {}),
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((chain, i) => {
              const st = STATUS_STYLES[chain.status];
              return (
                <tr
                  key={chain.id}
                  style={s.row}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#0f2820")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td style={s.tdName}>
                    <span style={{ ...s.colorDot, background: chain.color }} />
                    {chain.name}
                  </td>
                  <td style={s.tdSubnet}>{chain.subnet}</td>
                  <td style={s.td}>
                    {chain.tps === 0 ? (
                      <span style={{ color: "#3a5a50" }}>0</span>
                    ) : (
                      chain.tps
                    )}
                  </td>
                  <td style={s.td}>{chain.dailyTxns}</td>
                  <td style={s.td}>{chain.activeAddrs}</td>
                  <td style={s.td}>{chain.contracts}</td>
                  <td style={s.td}>
                    <span
                      style={{
                        ...s.statusBadge,
                        background: st.bg,
                        color: st.color,
                      }}
                    >
                      {st.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Footer */}
        <div style={s.footer}>
          <span style={s.showing}>
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div style={s.pagination}>
            <button
              style={s.pageBtn}
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                style={{ ...s.pageBtn, ...(page === p ? s.pageBtnActive : {}) }}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              style={s.pageBtn}
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

const s = {
  searchWrap: {
    display: "flex",
    alignItems: "center",
    background: "#0d1f1a",
    border: "1px solid #1a3329",
    borderRadius: "6px",
    padding: "6px 12px",
    flex: "0 0 220px",
  },
  searchInput: {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#c8ede4",
    fontSize: "12px",
    width: "100%",
    fontFamily: "inherit",
  },
  dropBtn: {
    background: "#0d1f1a",
    border: "1px solid #2dd4a7",
    borderRadius: "6px",
    color: "#2dd4a7",
    fontSize: "12px",
    fontWeight: 600,
    padding: "6px 12px",
    cursor: "pointer",
    fontFamily: "inherit",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  caret: { fontSize: 10 },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 4px)",
    left: 0,
    background: "#0d1f1a",
    border: "1px solid #1a3329",
    borderRadius: "6px",
    zIndex: 99,
    minWidth: "130px",
    overflow: "hidden",
  },
  dropItem: {
    padding: "8px 14px",
    fontSize: "12px",
    color: "#8abcae",
    cursor: "pointer",
    transition: "background 0.1s",
  },
  dropItemActive: {
    color: "#2dd4a7",
    background: "#0f2820",
  },
  totalBadge: {
    marginLeft: "auto",
    color: "#4a7a6a",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.05em",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
  },
  th: {
    color: "#4a7a6a",
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    textAlign: "right",
    padding: "8px 20px",
    borderTop: "1px solid #1a3329",
    borderBottom: "1px solid #1a3329",
    background: "#0a1612",
  },
  row: {
    borderBottom: "1px solid #111e1b",
    transition: "background 0.12s",
    cursor: "pointer",
  },
  td: {
    textAlign: "right",
    padding: "11px 20px",
    color: "#c8ede4",
    fontVariantNumeric: "tabular-nums",
  },
  tdName: {
    textAlign: "left",
    padding: "11px 20px",
    fontWeight: 600,
    color: "#e8faf5",
    display: "flex",
    alignItems: "center",
    gap: 10,
    whiteSpace: "nowrap",
  },
  tdSubnet: {
    textAlign: "left",
    padding: "11px 20px",
    color: "#2d9cdb",
    fontFamily: "'DM Mono', monospace",
    fontSize: "12px",
    cursor: "pointer",
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: "2px",
    flexShrink: 0,
    display: "inline-block",
  },
  statusBadge: {
    display: "inline-block",
    borderRadius: "5px",
    padding: "3px 10px",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.04em",
    whiteSpace: "nowrap",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 20px",
    borderTop: "1px solid #1a3329",
  },
  showing: {
    color: "#4a7a6a",
    fontSize: "11px",
  },
  pagination: {
    display: "flex",
    gap: 4,
  },
  pageBtn: {
    background: "#0d1f1a",
    border: "1px solid #1a3329",
    borderRadius: "5px",
    color: "#8abcae",
    fontSize: "12px",
    fontWeight: 600,
    padding: "4px 10px",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.12s",
    minWidth: 30,
  },
  pageBtnActive: {
    background: "#1a3329",
    border: "1px solid #2dd4a7",
    color: "#e8faf5",
  },
};
