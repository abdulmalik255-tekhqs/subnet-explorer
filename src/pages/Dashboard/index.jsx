import React from "react";
import Navbar from "./DashboardComponent/Navbar";
import ChainPulse from "./DashboardComponent/ChainPulse";
import NetworkOverview from "./DashboardComponent/NetworkOverview";
import PrimaryNetworkPinned from "./L1s/PrimaryNetworkPinned";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#060B15] text-white -m-5">
      <Navbar />
      <ChainPulse />

      <div className="px-6 pb-10">
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
          <span className="text-blue-500">/</span>
          <span>Overview</span>
        </div>

        <NetworkOverview />

        <PrimaryNetworkPinned />
      </div>
    </div>
  );
};

export default Dashboard;
