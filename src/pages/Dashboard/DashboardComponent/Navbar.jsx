import React, { useState } from "react";
import { MagnifyingGlass, Command, CaretDown } from "@phosphor-icons/react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const options = ["Beam L1", "Game L1", "even", "Blaze", "FIFA Blockchain", "Hashfire"];
  const [selected, setSelected] = useState("Game L1");
  const [open, setOpen] = useState(false);
  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `px-4 py-1.5 rounded-md text-sm font-medium cursor-pointer transition-colors ${
      isActive ? "bg-[#1E293B] text-white" : "text-gray-400 hover:text-white"
    }`;
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-[#0B111D] border-b border-gray-800 text-white">
      {/* Left side: Logo and Chain Selector */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#2563EB] rounded-md flex items-center justify-center font-bold text-lg">
            RY
          </div>
          <span className="text-xl font-bold tracking-tight">RYTExplorer</span>
          <span className="w-2 h-2 bg-blue-500 rounded-full ml-1"></span>
        </div>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 bg-[#1E293B] px-2 py-1 rounded-xl border border-[#334155] min-w-[120px]"
          >
            <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />
            <span className="text-white font-medium flex-1 text-left">
              {selected}
            </span>
            <CaretDown
              size={16}
              className={`text-gray-400 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <div className="absolute top-full left-0 mt-2 w-full rounded-xl min-w-[180px] border border-[#334155] bg-[#0F172A] shadow-xl overflow-hidden z-50">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSelected(option);
                    setOpen(false);
                    navigate(`/subnets/network/${option}`);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm hover:bg-[#1E293B] transition-colors ${
                    selected === option
                      ? "bg-[#1E293B] text-white"
                      : "text-gray-300"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 ml-4">
          <p onClick={() => navigate("/")} className={getLinkClass("/")}>
            Overview
          </p>
          <p
            onClick={() => navigate("/subnets")}
            className={getLinkClass("/subnets")}
          >
            L1s
          </p>
          <p
            onClick={() => navigate("/tools")}
            className={getLinkClass("/tools")}
          >
            Tools
          </p>
        </div>
      </div>

      {/* Right side: Search and Block Info */}
      <div className="flex items-center gap-4">
        <div className="relative flex items-center group">
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
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-300">
            Block # 847,875
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
