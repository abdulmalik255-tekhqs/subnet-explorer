import React from "react";
import { MagnifyingGlass, Command, CaretDown } from "@phosphor-icons/react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

        <div className="flex items-center gap-2 bg-[#1E293B] px-3 py-1.5 rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors">
          <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
          <span className="text-sm font-medium">Game L1</span>
          <CaretDown size={14} className="text-gray-400" />
        </div>

        <div className="flex items-center gap-6 ml-4">
          <a onClick={() => navigate("/")} className={getLinkClass("/")}>
            Overview
          </a>
          <a
            onClick={() => navigate("/subnets")}
            className={getLinkClass("/subnets")}
          >
            L1s
          </a>
          <a
            onClick={() => navigate("/tools")}
            className={getLinkClass("/tools")}
          >
            Tools
          </a>
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
