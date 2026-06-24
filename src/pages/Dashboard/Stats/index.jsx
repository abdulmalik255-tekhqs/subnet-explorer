import React from "react";
import TotalStats from "./TotalStat";
import TPS from "./TPS";
import LiveNetworkHealthMetrics from "./LiveNetwork";
import TransactionLiveCycleFlow from "./TransactionLiveCycleFlow";
import NetworkHealth from "./NetworkHealth";
import GlobalNetworkDistribution from "./GlobalNetworkDistribution";

const Stats = () => {
  return (
    <div className="w-full">
      <div className="grid w-full grid-cols-1 gap-3 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-8 gap-[20px] flex flex-col">
          <TotalStats />
          <LiveNetworkHealthMetrics />
          <GlobalNetworkDistribution />
        </div>
        <div className="min-w-0 xl:col-span-4  gap-[20px] flex flex-col">
          <TPS />
          <TransactionLiveCycleFlow />
          <NetworkHealth />
        </div>
      </div>
    </div>
  );
};

export default Stats;
