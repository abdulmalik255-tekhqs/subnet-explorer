import classNames from "classnames";
import { useSelector } from "react-redux";

const ContractTab = ({ activeTab = "overview", onChange = () => {} }) => {
  const { addressInfo } = useSelector((state) => state.transactions);
  return (
    <>
      <div className="mb-3 inline-flex flex-wrap items-center gap-2 p-3 bg-bryt-grey-200 rounded-md">
        <button
          className={classNames(
            "py-[5px] px-[9px] bg-bryt-grey-200 rounded-lg text-bryt-primary-main",
            activeTab === "code" && "text-white bg-bryt-primary-main"
          )}
          onClick={() => onChange("code")}
        >
          <p className="text-inherit text-[12.6px] font-semibold">Code</p>
        </button>
        {addressInfo?.is_verified && (
          <>
            <button
              className={classNames(
                "py-[5px] px-[9px] bg-bryt-grey-200 rounded-lg text-bryt-primary-main",
                activeTab === "read" && "text-white bg-bryt-primary-main"
              )}
              onClick={() => onChange("read")}
            >
              <p className="text-inherit text-[12.6px] font-semibold">
                Read Contract
              </p>
            </button>
            <button
              className={classNames(
                "py-[5px] px-[9px] bg-bryt-grey-200 rounded-lg text-bryt-primary-main",
                activeTab === "write" && "text-white bg-bryt-primary-main"
              )}
              onClick={() => onChange("write")}
            >
              <p className="text-inherit text-[12.6px] font-semibold">
                Write Contract
              </p>
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default ContractTab;
