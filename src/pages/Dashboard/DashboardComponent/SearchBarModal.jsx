import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { isValidBlock } from "../../../utils";
import axios from "axios";
import { baseApiKey, baseSearchUrl } from "../../../app.config";

const TYPE_COLORS = {
  transaction: "#1D4ED8",
  block: "#065F46",
  contract: "#7C3AED",
  address: "#B45309",
  l1: "#0F3460",
  network: "#0F3460",
  orbit: "#0F3460",
};

// Block search results carry the block *hash* in `value`, but the block-detail
// route is keyed by block *number* — pull it back out of the title instead
// ("Block #67" -> "67"). A tx hash and a block hash are both 66-char hex
// strings, so shape alone can't tell them apart — `item.type` still has to
// make that call; ethers only needs to distinguish address vs. hash.
const parseBlockNumber = (title = "") => {
  const match = title.match(/#(\d+)/);
  return match ? match[1] : "";
};

const getSearchHref = (item) => {
  const chainId = item.chain_id;
  const cleaned = (item.value || "").trim().toLowerCase();

  if (item.type === "block") {
    const blockNumber = parseBlockNumber(item.title);
    if (isValidBlock(blockNumber)) {
      return `/orbit/${chainId}/blocks/${blockNumber}`;
    }
  }

  if (ethers.isAddress(cleaned)) {
    return `/orbit/${chainId}/address/${cleaned}`;
  }

  if (ethers.isHexString(cleaned) && cleaned.length === 66) {
    return `/orbit/${chainId}/tx/${cleaned}`;
  }

  return `/orbit/network/${encodeURIComponent(item.chain_name)}`;
};

const KbdHint = ({ keys, label }) => (
  <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
    {keys.map((k) => (
      <kbd
        key={k}
        className="px-1.5 py-0.5 bg-[#1E293B] border border-gray-700 rounded text-[10px] font-mono text-gray-400"
      >
        {k}
      </kbd>
    ))}
    <span>{label}</span>
  </div>
);

const ChainIcon = ({ color, size = 40 }) => (
  <span
    className="flex-shrink-0 rounded-lg"
    style={{ width: size, height: size, backgroundColor: color }}
  />
);

const SearchBarModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { primary, orbits, searchHistory } = useSelector((s) => s.orbit);
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [selectedChain, setSelectedChain] = useState("All chains");
  const [focused, setFocused] = useState(0);
  const [liveResults, setLiveResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const inputRef = useRef(null);
  const requestIdRef = useRef(0);

  /* auto-focus input + refresh recent searches when modal opens */
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setLiveResults([]);
      setFocused(0);
      setSelectedChain("All chains");
      setTimeout(() => inputRef.current?.focus(), 30);
      dispatch.orbit.getLatestSearchHistory();
    }
  }, [isOpen, dispatch]);

  /* resolve the selected chip to { chainType, chainId } for the search query */
  const resolveChainFilter = useCallback(
    (chipName) => {
      if (chipName === "All chains")
        return { chainType: undefined, chainId: undefined };
      const orbit = (orbits ?? []).find((c) => c.name === chipName);
      if (orbit) return { chainType: "orbit", chainId: orbit.chain_id };
      const prim = (primary ?? []).find((c) => c.name === chipName);
      if (prim) return { chainType: "primary", chainId: prim.chain_id };
      return { chainType: undefined, chainId: undefined };
    },
    [orbits, primary],
  );

  /* debounced live search as the user types */
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setLiveResults([]);
      setSearching(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    setSearching(true);
    const { chainType, chainId } = resolveChainFilter(selectedChain);

    const timer = setTimeout(async () => {
      const results = await dispatch.orbit.getSearchData({
        query: trimmed,
        chainType,
        chainId,
      });
      if (requestIdRef.current === requestId) {
        setLiveResults(results ?? []);
        setSearching(false);
        setFocused(0);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, selectedChain, dispatch, resolveChainFilter]);

  const isSearchingQuery = query.trim().length > 0;

  /* filter recent searches by selected chain */
  const recent = (searchHistory ?? []).filter((r) => {
    if (selectedChain === "All chains") return true;
    return r.chain_name === selectedChain;
  });

  const results = isSearchingQuery ? liveResults : recent;

  /* ESC + arrow key navigation */
  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocused((f) => Math.min(f + 1, (results?.length ?? 1) - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocused((f) => Math.max(f - 1, 0));
      }
      if (e.key === "Enter" && results?.[focused]) {
        navigate(getSearchHref(results[focused]));
        onClose();
      }
    },
    [isOpen, focused, navigate, onClose, results],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  /* chip list: All chains + primary + first few orbits */
  const chainChips = [
    "All chains",
    ...(primary ?? []).map((c) => c.name),
    ...(orbits ?? []).slice(0, 3).map((c) => c.name),
  ];
  const routeSearch = (item) => {
    const payload = {
      type: item.type,
      chainType: item.chain_type,
      chainId: item.chain_id,
      chainName: item.chain_name,
      title: item.title,
      subtitle: item.subtitle,
      value: item.value,
    };
    axios
      .post(`${baseSearchUrl}`, payload, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": baseApiKey,
        },
      })
      .catch((error) => {
        console.error("Error logging search:", error);
      });
    navigate(getSearchHref(item));
    onClose();
  };
  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-black/60 backdrop-blur-sm pt-24 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[640px] bg-[#0F172A] border border-[#16284A] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
      >
        {/* ── Search input row ── */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800/60">
          <svg
            className="text-gray-600 flex-shrink-0"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tx hash, block, address..."
            className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="px-2 py-0.5 bg-[#1E293B] border border-gray-700 rounded text-[11px] font-mono text-gray-400 hover:text-gray-200 hover:border-gray-600 transition-colors flex-shrink-0"
          >
            ESC
          </button>
        </div>

        {/* ── Chain filter chips ── */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800/40 flex-wrap">
          {chainChips?.map((chip) => (
            <button
              key={chip}
              onClick={() => setSelectedChain(chip)}
              className={`px-3 py-1 !rounded-[50px] text-xs font-medium transition-colors border ${
                selectedChain === chip
                  ? "border-blue-500 text-blue-400 bg-blue-500/10"
                  : "border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-300"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* ── Results ── */}
        <div className="px-4 pt-3 pb-1">
          <span className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">
            {isSearchingQuery ? "Search Results" : "Recent Searches"}
          </span>
        </div>

        <div className="pb-2 max-h-[360px] overflow-y-auto">
          {isSearchingQuery && searching ? (
            <div className="px-4 py-6 text-center text-xs text-gray-700">
              Searching…
            </div>
          ) : results?.length === 0 ? (
            <div className="px-4 py-6 text-center text-xs text-gray-700">
              {isSearchingQuery
                ? "No results found"
                : "No recent searches for this chain"}
            </div>
          ) : (
            results?.map((item, i) => (
              <button
                key={`${item.type}-${item.value}-${i}`}
                onClick={() => routeSearch(item)}
                onMouseEnter={() => setFocused(i)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  focused === i ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                }`}
              >
                <ChainIcon
                  color={TYPE_COLORS[item.type] ?? "#334155"}
                  size={38}
                />
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-medium text-gray-200 truncate">
                    {item.title}
                  </span>
                  <span className="text-xs text-gray-600 font-mono">
                    {item.subtitle}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* ── Footer keyboard hints ── */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-gray-800/60">
          <KbdHint keys={["↕"]} label="navigate" />
          <KbdHint keys={["↵"]} label="open" />
          <KbdHint keys={["ESC"]} label="close" />
        </div>
      </div>
    </div>
  );
};

export default SearchBarModal;
