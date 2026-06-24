import classNames from "classnames";

const TransactionsTabs = ({ activeTab = "overview", onChange = () => { } }) => {
  return (
    <>
      <div className="flex items-center gap-3">
        <p className="text-[19px] font-semibold">Transaction Details</p>
        <div className="flex items-center gap-1"></div>
      </div>
      <div className="border-t border-t-bryt-grey-200 mt-[19px]"></div>
      <p className="text-[14.5px] text-bryt-primary-main mt-[10px] mb-[30px]">
        Use <span className="font-bold">RYT SDK</span> for network
        communications
      </p>
      <div className="mb-3 inline-flex flex-wrap items-center gap-2 p-3 bg-bryt-grey-200 rounded-md">
        <button
          className={classNames(
            "py-[5px] px-[9px] bg-bryt-grey-200 rounded-lg text-bryt-primary-main",
            activeTab === "overview" && "text-white bg-bryt-primary-main"
          )}
          onClick={() => onChange("overview")}
        >
          <p className="text-inherit text-[12.6px] font-semibold">Overview</p>
        </button>
        <button
          className={classNames(
            "py-[5px] px-[9px] bg-bryt-grey-200 rounded-lg text-bryt-primary-main",
            activeTab === "internal" && "text-white bg-bryt-primary-main"
          )}
          onClick={() => onChange("internal")}
        >
          <p className="text-inherit text-[12.6px] font-semibold">
            Internal Txns
          </p>
        </button>
        <button
          className={classNames(
            "py-[5px] px-[9px] bg-bryt-grey-200 rounded-lg text-bryt-primary-main",
            activeTab === "logs" && "text-white bg-bryt-primary-main"
          )}
          onClick={() => onChange("logs")}
        >
          <p className="text-inherit text-[12.6px] font-semibold">Logs</p>
        </button>
        <button
          className={classNames(
            "py-[5px] px-[9px] bg-bryt-grey-200 rounded-lg text-bryt-primary-main",
            activeTab === "state" && "text-white bg-bryt-primary-main"
          )}
          onClick={() => onChange("state")}
        >
          <p className="text-inherit text-[12.6px] font-semibold">state</p>
        </button>
      </div>
    </>
  );
};

export default TransactionsTabs;
