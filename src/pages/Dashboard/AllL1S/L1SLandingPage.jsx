import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { MagnifyingGlass } from "@phosphor-icons/react";
import Navbar from "../DashboardComponent/Navbar";
import Explorer from "./Explorer";
import Stats from "./Stats";
import Details from "./Details";
import { getChainConfig } from "./demoData";

const TABS = ["Explorer", "Stats", "Details"];

const ChainLogo = ({ colors }) => (
  <div className="grid grid-cols-2 gap-0.5 w-9 h-9 flex-shrink-0">
    {colors.slice(0, 4).map((color, i) => (
      <div
        key={i}
        className="rounded-sm"
        style={{ backgroundColor: color }}
      />
    ))}
  </div>
);

const L1SLandingPage = () => {
  const { subnetName } = useParams();
  const [activeTab, setActiveTab] = useState("Explorer");

  const chain = getChainConfig(decodeURIComponent(subnetName || ""));

  return (
    <div className="min-h-screen bg-[#060B15] text-white -m-5">
      <Navbar />

      {/* Chain-specific header */}
      <div className="bg-[#0B111D] border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ChainLogo colors={chain.colors} />
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">{chain.name}</h1>
              <span className="text-xs text-gray-500">Chain ID: {chain.chainId}</span>
            </div>
          </div>

          <div className="relative flex items-center flex-1 max-w-lg">
            <MagnifyingGlass className="absolute left-3 text-gray-500" size={16} />
            <input
              type="text"
              placeholder={`Search all Avalanche L1s for tx hash, block ID, address, token, ...`}
              className="w-full bg-[#111827] border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#0B111D] border-b border-gray-800 px-6">
        <div className="flex items-center gap-0">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "text-white border-blue-500"
                  : "text-gray-400 border-transparent hover:text-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-0">
        {activeTab === "Explorer" && <Explorer chain={chain} />}
        {activeTab === "Stats" && <Stats chain={chain} />}
        {activeTab === "Details" && <Details chain={chain} />}
      </div>
    </div>
  );
};

export default L1SLandingPage;
