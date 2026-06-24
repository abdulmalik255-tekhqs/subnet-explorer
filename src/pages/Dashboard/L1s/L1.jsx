import React from "react";
import Navbar from "../DashboardComponent/Navbar";
import ChainPulse from "../DashboardComponent/ChainPulse";
import L1Stats from "./L1Stats";
import PrimaryNetworkPinned from "./PrimaryNetworkPinned";
import RegisteredL1sTable from "./RegisteredL1sTable";

const L1Component = () => {
  return (
    <div className="min-h-screen bg-[#060B15] text-white -m-5">
      <Navbar />
      <ChainPulse />

      <div className="">
        <div className="flex items-center gap-2 text-xs text-gray-500 border-b border-gray-800 w-full max-w-full px-6 py-[8px]">
          <span className="text-blue-500">/</span>
          <span>L1 directory</span>
        </div>
        <div className="flex flex-col items-start gap-2 mt-4 px-6 w-full">
          <h1 className="text-2xl font-bold text-white">L1 Directory</h1>
          <L1Stats />
          <PrimaryNetworkPinned />
          <RegisteredL1sTable />
        </div>
      </div>
    </div>
  );
};

export default L1Component;
