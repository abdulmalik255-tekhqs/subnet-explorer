import ActiveChunks from "./ActiveChunks";
import CurrentThroughPutChart from "./CurrentThroughPutChart";
import FinalityChart from "./FinalityChart";
import PerformanceChart from "./PerformanceChart";
import TransactionActivityChart from "./TransactionActivityChart";

const Charts = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ActiveChunks />
        <CurrentThroughPutChart />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-[12px]">
        <FinalityChart />
        <PerformanceChart />
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-1 mt-[12px]">
        <TransactionActivityChart />
      </div>
    </>
  );
};

export default Charts;
