import { useState, useRef, useEffect } from "react";

const generateData = (days, seed = 1) => {
  const points = [];
  let value = 4200 + seed * 100;
  for (let i = 0; i < days; i++) {
    value += Math.sin(i * 0.7 + seed) * 80 + (Math.random() * 60 - 30);
    value = Math.max(3800, Math.min(4800, value));
    points.push(Math.round(value));
  }
  return points;
};

const DATA = {
  "1D": generateData(24, 1),
  "7D": generateData(7, 2),
  "30D": generateData(30, 3),
};

const LABELS = {
  "1D": Array.from({ length: 24 }, (_, i) => `${i}:00`),
  "7D": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  "30D": Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
};

export default function TransactionChart() {
  const [range, setRange] = useState("7D");
  const [tooltip, setTooltip] = useState(null);
  const svgRef = useRef(null);

  const data = DATA[range];
  const labels = LABELS[range];

  const PAD = { top: 20, right: 16, bottom: 8, left: 8 };
  const WIDTH = 860;
  const HEIGHT = 110;
  const chartW = WIDTH - PAD.left - PAD.right;
  const chartH = HEIGHT - PAD.top - PAD.bottom;

  const minV = Math.min(...data) - 100;
  const maxV = Math.max(...data) + 100;

  const toX = (i) => PAD.left + (i / (data.length - 1)) * chartW;
  const toY = (v) => PAD.top + chartH - ((v - minV) / (maxV - minV)) * chartH;

  const linePath = data
    .map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i)},${toY(v)}`)
    .join(" ");

  const areaPath =
    linePath +
    ` L ${toX(data.length - 1)},${PAD.top + chartH} L ${PAD.left},${PAD.top + chartH} Z`;

  const handleMouseMove = (e) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = WIDTH / rect.width;
    const mx = (e.clientX - rect.left) * scaleX - PAD.left;
    const idx = Math.round((mx / chartW) * (data.length - 1));
    const clamped = Math.max(0, Math.min(data.length - 1, idx));
    setTooltip({
      x: toX(clamped),
      y: toY(data[clamped]),
      value: data[clamped].toLocaleString(),
      label: labels[clamped],
    });
  };

  return (
    <div className="bg-[#111827] border border-gray-800/60 rounded-2xl p-3 shadow-2xl shadow-black/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-gray-500 font-bold uppercase tracking-widest opacity-70">
          TRANSACTION COUNT — <span className="text-blue-500">{range}</span>
        </span>
        <div className="flex items-center gap-2">
          {["1D", "7D", "30D"].map((r) => (
            <button
              key={r}
              onClick={() => {
                setRange(r);
                setTooltip(null);
              }}
              style={{
                ...styles.tab,
                ...(range === r ? styles.tabActive : {}),
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={styles.chartArea}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="none"
          style={styles.svg}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTooltip(null)}
        >
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2dd4a7" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#2dd4a7" stopOpacity="0.01" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Area fill */}
          <path d={areaPath} fill="url(#areaGrad)" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#2dd4a7"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {/* Tooltip elements */}
          {tooltip && (
            <>
              <line
                x1={tooltip.x}
                y1={PAD.top}
                x2={tooltip.x}
                y2={PAD.top + chartH}
                stroke="#2dd4a7"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.5"
              />
              <circle
                cx={tooltip.x}
                cy={tooltip.y}
                r="4"
                fill="#0d1f1a"
                stroke="#2dd4a7"
                strokeWidth="2"
              />
            </>
          )}
        </svg>

        {/* Tooltip box */}
        {tooltip && (
          <div
            style={{
              ...styles.tooltip,
              left: `${(tooltip.x / WIDTH) * 100}%`,
              top: `${((tooltip.y - PAD.top) / HEIGHT) * 100}%`,
            }}
          >
            <div style={styles.tooltipLabel}>{tooltip.label}</div>
            <div style={styles.tooltipValue}>{tooltip.value}</div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    background: "#0d1f1a",
    border: "1px solid #1a3329",
    borderRadius: "10px",
    padding: "16px 20px 12px",
    fontFamily: "'Inter', 'DM Mono', monospace",
    width: "100%",
    maxWidth: "900px",
    boxSizing: "border-box",
    userSelect: "none",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  title: {
    color: "#2dd4a7",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  rangeBadge: {
    color: "#2dd4a7",
  },
  tabs: {
    display: "flex",
    gap: "2px",
    background: "#0a1612",
    borderRadius: "6px",
    padding: "2px",
    border: "1px solid #1a3329",
  },
  tab: {
    background: "transparent",
    border: "none",
    color: "#4a7a6a",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.06em",
    padding: "4px 10px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "all 0.15s ease",
    fontFamily: "inherit",
  },
  tabActive: {
    background: "#1a3329",
    color: "#e0fff7",
  },
  chartArea: {
    position: "relative",
    width: "100%",
  },
  svg: {
    width: "100%",
    height: "110px",
    display: "block",
    overflow: "visible",
  },
  tooltip: {
    position: "absolute",
    transform: "translate(-50%, -110%)",
    background: "#0a1612",
    border: "1px solid #2dd4a7",
    borderRadius: "6px",
    padding: "5px 10px",
    pointerEvents: "none",
    whiteSpace: "nowrap",
  },
  tooltipLabel: {
    color: "#4a7a6a",
    fontSize: "10px",
    letterSpacing: "0.05em",
    textAlign: "center",
  },
  tooltipValue: {
    color: "#2dd4a7",
    fontSize: "13px",
    fontWeight: 700,
    textAlign: "center",
    marginTop: "1px",
  },
};
