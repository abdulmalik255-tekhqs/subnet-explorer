import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import { useParams, useNavigate } from "react-router-dom";
import TransactionsTabs from "../../components/TransactionTabs";
import { useSelector } from "react-redux";
import ASSETS from "../../assets";
import { downloadAsCSV } from "../../utils";

dayjs.extend(utc);
dayjs.extend(relativeTime);
const InternalTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { internalTxns } = useSelector((state) => state.transactions);
  return (
    <>
      <div className="flex-grow bg-blocks px-20 py-8">
        <TransactionsTabs
          activeTab={"internal"}
          onChange={(val) => {
            if (val === "overview") {
              navigate(`/tx/${id}`, {
                state: { id },
              });
              return;
            }
            if (val === "logs") {
              // navigate to logs route if you have one, or just set tab
              navigate(`/tx/${id}/eventlog`);

              return;
            }
            if (val === "state") {
              // navigate to state route if you have one, or just set tab
              navigate(`/tx/${id}/state`);

              return;
            }
          }}
        />
        <div className="bg-white  border border-bryt-grey-200 rounded-[12px] shadow-txBox mt-3">
          <div className="flex items-center justify-between py-5 px-[17px]">
            <div className="flex items-center gap-2">
              <img src={ASSETS.arrowDownList} alt="" />
              <p className="text-[14.5px]">
                Latest 0 from a total of{" "}
                <span className="text-bryt-primary-main">0</span> transactions
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div
                onClick={() => downloadAsCSV(internalTxns, `transactions.csv`)}
                className="flex items-center gap-[6px] border border-bryt-grey-200 h-[29px] px-[10px] rounded-md cursor-pointer"
              >
                <img src={ASSETS.download} alt="" />
                <p className="text-[12.5px]"> Download Page Data</p>
              </div>
              {/* <div className="flex items-center gap-[6px] border border-bryt-grey-200 h-[29px] px-[10px] rounded-md cursor-not-allowed">
                              <img src={ASSETS.cone} alt="" />
                              <img src={ASSETS.arrowDown} alt="" />
                            </div> */}
            </div>
          </div>
          <div className="w-full overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-bryt-primary-main h-[38px] [&_td]:px-4">
                  <td className="">
                    <img src={ASSETS.infoLight} alt="" />
                  </td>
                  <td className="text-[12.5px] font-bold text-white">
                    Parent Txn Hash
                  </td>

                  <td className="text-[12.5px] font-bold text-white">Block</td>
                  <td className="text-[12.5px] font-bold text-white">From</td>
                  <td className="text-[12.5px] font-bold text-white">To</td>
                  <td className="text-[12.5px] font-bold text-white">Value</td>
                  <td className="text-[12.5px] font-bold text-white">Age</td>
                </tr>
              </thead>
              <tbody>
                {internalTxns?.length > 0 ? (
                  internalTxns.map((txn, index) => (
                    <tr key={index} className="h-[38px] [&_td]:px-4">
                      <td>{/* icon or something */}</td>
                      <td>{txn.parentHash}</td>
                      <td>{txn.block}</td>
                      <td>{txn.from}</td>
                      <td>{txn.to}</td>
                      <td>{txn.value}</td>
                      <td>{dayjs(txn.timestamp).fromNow()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-500">
                      No Internal Transaction found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
export default InternalTransaction;
