import React, { useState, useEffect, useRef } from "react";
import useTheme from "../../../hooks/useTheme";
import { MagnifyingGlass, Command, CaretDown } from "@phosphor-icons/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import SearchBarModal from "./SearchBarModal";

const ORBIT_COLORS = [
  "#2563EB",
  "#0EA5E9",
  "#F59E0B",
  "#22C55E",
  "#A855F7",
  "#EC4899",
  "#14B8A6",
  "#F97316",
];

const PRIMARY_COLORS = ["#EF4444", "#E11D48", "#DC2626", "#B91C1C"];

const ALL_CHAINS_ITEM = { name: "All chains", chain_id: "all" };

const ChainSquare = ({ color }) => (
  <span
    className="inline-block w-3.5 h-3.5 rounded-sm flex-shrink-0"
    style={{ backgroundColor: color }}
  />
);

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const { isDarkTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { primary, orbits, loading, dashboard } = useSelector((s) => s.orbit);
  const [selected, setSelected] = useState(ALL_CHAINS_ITEM);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch.orbit.handleGetAllChains();
    dispatch.orbit.handleGetOrbitDashboard({ type: "primary" });
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const getLinkClass = (path) => {
    const isActive =
      path === "/"
        ? location.pathname === path
        : location.pathname === path ||
          location.pathname.startsWith(`${path}/`);

    return `px-4 py-1.5 rounded-md text-sm font-medium cursor-pointer transition-colors ${
      isActive ? "bg-[#1E293B] text-white" : "text-gray-400 hover:text-white"
    }`;
  };

  const handleSelect = (item, color, type = "orbit") => {
    setSelected({ ...item, color });
    setOpen(false);
    if (item.chain_id === "all") {
      dispatch.orbit.setSelectedDirectoryChain(null);
      navigate("/");
    } else {
      dispatch.orbit.setSelectedDirectoryChain({ chain: item, type });
      navigate("/orbit");
    }
  };

  const selectedColor =
    selected.chain_id === "all"
      ? "#2563EB"
      : (selected.color ?? ORBIT_COLORS[0]);

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-3 bg-[#0B111D] border-b border-gray-800 text-white">
        <div className="flex items-center gap-8">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 bg-[#2563EB] rounded-md flex items-center justify-center font-bold text-lg">
              RY
            </div>
            <span className="text-xl font-bold tracking-tight">
              RYTExplorer
            </span>
            <span className="w-2 h-2 bg-blue-500 rounded-full ml-1" />
          </div>

          {/* Chain dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 bg-[#1E293B] px-3 py-1.5 rounded-xl border border-[#334155] min-w-[130px]"
            >
              <ChainSquare color={selectedColor} />
              <span className="text-white font-medium flex-1 text-left text-sm">
                {selected.name}
              </span>
              <CaretDown
                size={14}
                className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              />
            </button>

            {open && (
              <div className="max-h-[400px] overflow-y-auto absolute top-full left-0 mt-2 w-56 rounded-xl border border-[#1E293B] bg-[#0F172A] shadow-2xl z-50">
                {/* PRIMARY NETWORK section */}
                <div className="px-4 pt-4 pb-1">
                  <span className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase">
                    Primary Network
                  </span>
                </div>

                {/* All chains */}
                <button
                  onClick={() =>
                    handleSelect(ALL_CHAINS_ITEM, "#2563EB", "all")
                  }
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#1E293B] ${
                    selected.chain_id === "all"
                      ? "bg-[#1E293B] text-white"
                      : "text-gray-300"
                  }`}
                >
                  <ChainSquare color="#2563EB" />
                  All chains
                </button>

                {/* Primary chains */}
                {loading && primary?.length === 0 ? (
                  <div className="px-4 py-2 text-xs text-gray-600">
                    Loading...
                  </div>
                ) : (
                  primary?.map((chain, i) => (
                    <button
                      key={chain.chain_id}
                      onClick={() =>
                        handleSelect(
                          chain,
                          PRIMARY_COLORS[i % PRIMARY_COLORS.length],
                          "primary",
                        )
                      }
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#1E293B] ${
                        selected.chain_id === chain.chain_id
                          ? "bg-[#1E293B] text-white"
                          : "text-gray-300"
                      }`}
                    >
                      <ChainSquare
                        color={PRIMARY_COLORS[i % PRIMARY_COLORS.length]}
                      />
                      {chain?.name}
                    </button>
                  ))
                )}
                {/* L1S section */}
                {orbits?.length > 0 && (
                  <>
                    <div className="px-4 pt-4 pb-1">
                      <span className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase">
                        Orbit
                      </span>
                    </div>
                    {orbits?.map((chain, i) => (
                      <button
                        key={chain.chain_id}
                        onClick={() =>
                          handleSelect(
                            chain,
                            ORBIT_COLORS[(i + 1) % ORBIT_COLORS.length],
                            "orbit",
                          )
                        }
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#1E293B] ${
                          selected.chain_id === chain.chain_id
                            ? "bg-[#1E293B] text-white"
                            : "text-gray-300"
                        }`}
                      >
                        <ChainSquare
                          color={ORBIT_COLORS[(i + 1) % ORBIT_COLORS.length]}
                        />
                        {chain?.name}
                      </button>
                    ))}
                  </>
                )}
                {/* <div className="h-2" /> */}
              </div>
            )}
          </div>
          <div className="flex items-center gap-6 ml-4">
            <p onClick={() => navigate("/")} className={getLinkClass("/")}>
              Overview
            </p>
            <p
              onClick={() => navigate("/orbit")}
              className={getLinkClass("/orbit")}
            >
              Orbits
            </p>
            {/* <p
              onClick={() => navigate("/tools")}
              className={getLinkClass("/tools")}
            >
              Tools
            </p> */}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="relative flex items-center group"
            onClick={() => setIsModalOpen(true)}
          >
            <MagnifyingGlass
              className="absolute left-3 text-gray-500 group-focus-within:text-blue-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search tx, block, address..."
              className="bg-[#111827] border border-gray-700 rounded-lg pl-10 pr-16 py-1.5 text-sm w-80 focus:outline-none focus:border-blue-500 transition-all"
            />
            <div className="absolute right-3 flex items-center gap-1.5 text-gray-500 text-xs px-1.5 py-0.5 rounded border border-gray-700">
              <Command size={12} />
              <span>K</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#111827] border border-gray-800 rounded-lg px-4 py-1.5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-300">
              Block #{" "}
              {Number(dashboard?.latest_block_height || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </nav>
      <SearchBarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isDarkTheme={isDarkTheme}
      />
    </>
  );
};

export default Navbar;
