import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSpring, animated } from "react-spring";

const NumberAnimation = ({ number }) => {
  const numericValue = Number(number) || 0;

  const props = useSpring({
    from: { number: 0 },
    to: { number: numericValue },
    config: { duration: 1000 },
  });

  return (
    <animated.span>
      {props.number.to((value) => Math.floor(value).toLocaleString("en-US"))}
    </animated.span>
  );
};

const TotalStats = () => {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state.blocks);

  useEffect(() => {
    dispatch.blocks.handleGetdashboardDetail();
    const interval = setInterval(() => {
      dispatch.blocks.handleGetdashboardDetail();
    }, 10000);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3">
      <div className="bg-[#3498DB] rounded-[4px] min-h-[132px] w-full p-[16px] flex flex-col justify-between items-start">
        <h1 className="text-[16px] font-[600] text-white/80 -leading-[0.3] uppercase">
          Total Transactions
        </h1>
        <p className="text-[38px] font-[700] text-white p-0 m-0 w-full break-words">
          <NumberAnimation
            number={Number(dashboard?.dashboard?.total_transactions || 0)}
          />
        </p>
      </div>
      <div className="bg-[#22C55E] rounded-[4px] min-h-[132px] w-full p-[16px] flex flex-col justify-between items-start">
        <h1 className="text-[16px] font-[600] text-white/80 -leading-[0.3] uppercase">
          Latest Block Height
        </h1>
        <p className="text-[38px] font-[700] text-white p-0 m-0 w-full break-words">
          <NumberAnimation
            number={dashboard?.dashboard?.latest_block_height || 0}
          />
        </p>
      </div>
      <div className="bg-[#F59E0B] rounded-[4px] min-h-[132px] w-full p-[16px] flex flex-col justify-between items-start">
        <h1 className="text-[16px] font-[600] text-white/80 -leading-[0.3] uppercase">
          Total Accounts
        </h1>
        <p className="text-[38px] font-[700] text-white p-0 m-0 w-full break-words">
          <NumberAnimation number={dashboard?.dashboard?.total_accounts || 0} />
        </p>
      </div>
    </div>
  );
};

export default TotalStats;
