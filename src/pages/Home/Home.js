import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ASSETS from "../../assets";
// import Stats from './Components/Stats';
import Blocks from "./Components/Blocks";
import Transactions from "./Components/Transactions";
import Search from "./Components/Search";
import {
  Cube,
  HashStraight,
  UserList,
  ClockCountdown,
} from "@phosphor-icons/react";
import TxHistoryChart from "../../components/Grpah";

const Home = () => {
  const dispatch = useDispatch();
  const { dashboard, txnHistory } = useSelector((state) => state.blocks);
  const total = txnHistory?.totalTxs;
  useEffect(() => {
    dispatch.transactions.handleGetAllTxs();
    dispatch.transactions.handleGetLatestTransactionId();
    const interval = setInterval(() => {
      dispatch.transactions.handleGetAllTxs();
    }, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);
  return (
    <div className="flex-grow">
      <div
        className="h-[285px] bg-cover bg-center bg-no-repeat flex justify-center items-start px-20 flex-col bg-bryt-grey-100"
        style={{ backgroundImage: `url(${ASSETS.wavesOne})` }}
      >
        <p className="flex text-[16px] text-bryt-primary-main font-semibold gap-3 items-center">
          Titan Testnet Explorer{" "}
          <span>
            <p className="text-[12px] text-bryt-primary-light">
              ( Use <span className="font-bold">RYT SDK</span> for network
              communications )
            </p>
          </span>
        </p>
        <Search />
      </div>
      {/* <Stats /> */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 px-2 md:px-20 my-6 ">
        {/* LEFT SIDE — GRAPH */}
        <div className="lg:col-span-2 bg-white border border-bryt-grey-200 rounded-[16px] shadow-md p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-[14px] font-semibold text-bryt-primary-main flex items-center gap-2">
              <span className="text-bryt-primary-main">
                <HashStraight size={22} />
              </span>
              Transactions history
            </h2>

            <div className="border border-gray-300 rounded-lg px-3 py-1 text-sm text-bryt-grey-700 cursor-pointer">
              14 Days
            </div>
          </div>

          {/* Make the chart take remaining space */}
          <div className="flex-1 h-[300px]">
            <TxHistoryChart />
          </div>
        </div>

        {/* RIGHT SIDE — THREE CARDS */}
        <div className="flex flex-col gap-4 ">
          {/* Total Transactions */}
          <div className="border border-bryt-grey-200 rounded-[16px] p-3 shadow-md hover:bg-hover flex-1">
            <div className="flex items-start gap-3">
              <HashStraight size={22} className="text-bryt-primary-main" />
              <div className="flex flex-col">
                <h2 className="text-[14px] text-bryt-primary-main font-semibold">
                  Total Transactions
                </h2>
                <p className="text-[16px] font-normal text-bryt-grey-700">
                  {dashboard?.dashboard?.total_transactions || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Latest Block Height */}
          <div className="border border-bryt-grey-200 rounded-[16px] p-3 shadow-md hover:bg-hover flex-1">
            <div className="flex items-start gap-3">
              <Cube size={22} className="text-bryt-primary-main" />
              <div className="flex flex-col">
                <h2 className="text-[14px] text-bryt-primary-main font-semibold">
                  Latest Block Height
                </h2>
                <p className="text-[16px] font-normal text-bryt-grey-700">
                  {dashboard?.dashboard?.latest_block_height || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Total Accounts */}
          <div className="border border-bryt-grey-200 rounded-[16px] p-3 shadow-md hover:bg-hover flex-1">
            <div className="flex items-start gap-3">
              <UserList size={22} className="text-bryt-primary-main" />
              <div className="flex flex-col">
                <h2 className="text-[14px] text-bryt-primary-main font-semibold">
                  Total Accounts
                </h2>
                <p className="text-[16px] font-normal text-bryt-grey-700">
                  {dashboard?.dashboard?.total_accounts || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="border border-bryt-grey-200 rounded-[16px] p-3 shadow-md hover:bg-hover flex-1">
            <div className="flex items-start gap-3">
              <ClockCountdown size={22} className="text-bryt-primary-main" />
              <div className="flex flex-col">
                <h2 className="text-[14px] text-bryt-primary-main font-semibold">
                  Transactions 14 days
                </h2>
                <p className="text-[16px] font-normal text-bryt-grey-700">
                  {total || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 px-2 md:px-20 gap-4 mt-5 mb-20">
        <Blocks />
        <Transactions />
      </div>
    </div>
  );
};

export default Home;
