import React from "react";

const ChainPulse = () => {
  return (
    <div className="w-full bg-[#0B111D] px-6 py-2 flex items-center border-b border-gray-800">
      <div className="flex flex-col min-w-[120px]">
        <span className="text-[10px] font-bold text-gray-500 tracking-wider">
          CHAIN PULSE — TPS
        </span>
      </div>

      <div className="flex-1 h-12 relative overflow-hidden flex items-center">
        {/* Synthetic wave representation */}
        <svg viewBox="0 0 1000 40" className="w-full h-full opacity-60">
          <path
            d="M0 20 Q 25 5, 50 20 T 100 20 T 150 20 T 200 20 T 250 20 T 300 20 T 350 20 T 400 20 T 450 20 T 500 20 T 550 20 T 600 20 T 650 20 T 700 20 T 750 20 T 800 20 T 850 20 T 900 20 T 950 20 T 1000 20"
            fill="none"
            stroke="#22D3EE"
            strokeWidth="1.5"
            className="animate-[dash_2s_linear_infinite]"
          />
          <path
            d="M0 25 Q 25 10, 50 25 T 100 25 T 150 25 T 200 25 T 250 25 T 300 25 T 350 25 T 400 25 T 450 25 T 500 25 T 550 25 T 600 25 T 650 25 T 700 25 T 750 25 T 800 25 T 850 25 T 900 25 T 950 25 T 1000 25"
            fill="none"
            stroke="#2563EB"
            strokeWidth="0.8"
            className="animate-[dash_3s_linear_infinite]"
          />
        </svg>
      </div>

      <div className="flex items-center gap-1 text-[#22D3EE] font-bold text-lg">
        <span>2,210</span>
        <span className="text-sm font-normal text-gray-500">/s</span>
      </div>
    </div>
  );
};

export default ChainPulse;
