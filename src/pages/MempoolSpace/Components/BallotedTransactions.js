import { useNavigate } from "react-router-dom";
import ASSETS from "../../../assets";
import { shortenString, formatTokenAmount } from "../../../utils";
import { useSelector } from "react-redux";

const BallotedTransactions = () => {
  const navigate = useNavigate();
  const { ballotedTransactions } = useSelector((state) => state.transactions);

  return (
    <div className="border border-bryt-grey-200 shadow-navbar rounded-[12px] flex flex-col overflow-hidden min-h-60">
      <div className="bg-bryt-primary-main p-4 flex items-center justify-between">
        <p className="text-[15px] font-semibold text-white">
          Balloted Transactions
        </p>
      </div>
      <div
        className={` ${
          ballotedTransactions.length > 15
            ? "h-[400px] min-h-[400px] overflow-y-auto"
            : "h-full"
        }`}
      >
        {ballotedTransactions.length > 0 ? (
          ballotedTransactions?.map((transaction) => (
            <div
              key={transaction.hash}
              className={`py-[14px] px-4 flex justify-between items-center gap-10 hover:bg-hover cursor-pointer border-b border-b-bryt-grey-200 ${
                ballotedTransactions.length > 3 ? "last-of-type:border-b-0" : ""
              }`}
              onClick={() => navigate(`/tx/${transaction.hash}`)}
            >
              <div className="flex items-center gap-2">
                <div className="h-12 w-12 rounded-lg grid place-items-center bg-bryt-grey-100">
                  <img src={ASSETS.transaction} alt="" />
                </div>
                <div>
                  <p className="text-[14.5px]">
                    Hash{" "}
                    <span className="text-bryt-primary-main">
                      {shortenString(transaction?.hash) ||
                        "GENESIS_TRANSACTION"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="px-[9px] py-[7px] border border-bryt-grey-300 rounded-[6px]">
                <p className="text-[11px] font-semibold">
                  {formatTokenAmount(transaction?.value?.toString())} RYT
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300">
            No Transaction
          </div>
        )}
      </div>
    </div>
  );
};

export default BallotedTransactions;
