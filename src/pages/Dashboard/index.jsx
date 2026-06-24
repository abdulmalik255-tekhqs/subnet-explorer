import React from "react";
import Navbar from "./DashboardComponent/Navbar";
import ChainPulse from "./DashboardComponent/ChainPulse";
import NetworkOverview from "./DashboardComponent/NetworkOverview";
import PrimaryNetworkPinned from "./L1s/PrimaryNetworkPinned";
import GaugeChart from "./DashboardComponent/TPSLive";
import TransactionChart from "./DashboardComponent/TransactionChart";
import TopL1sByTPS from "./DashboardComponent/TopL1sByTPS";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#060B15] text-white -m-5">
      <Navbar />
      <ChainPulse />
      <div className="flex items-center gap-2 text-xs text-gray-500 border-b border-gray-800 w-full max-w-full px-6 py-[8px]">
        <span className="text-blue-500">/</span>
        <span>Overview</span>
      </div>
      <div className="px-6 pb-10">
        <NetworkOverview />
        <PrimaryNetworkPinned />
        <div className="flex flex-col lg:flex-row gap-4 mt-2">
          <TopL1sByTPS />
          <TransactionChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
