import classNames from "classnames";
import { AiFillCheckCircle } from "react-icons/ai";
import { useSelector } from "react-redux";

const AccountTabs = ({
  activeTab = "overview",
  onChange = () => {},
  accountType = "Address",
}) => {
  const { addressInfo } = useSelector((state) => state.transactions);

  return (
    <>
      <div className="flex flex-wrap items-center gap-[7px] mb-3 bg-bryt-grey-200 w-full md:w-auto max-w-full p-3 rounded-md">
        <button
          className={classNames(
            "py-[5px] px-[9px] bg-bryt-grey-200 rounded-lg text-bryt-primary-main",
            activeTab === "transactions" && "text-white bg-bryt-primary-main"
          )}
          onClick={() => onChange("transactions")}
        >
          <p className="text-inherit text-[12.6px] font-semibold">
            Transactions
          </p>
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
            activeTab === "erc" && "text-white bg-bryt-primary-main"
          )}
          onClick={() => onChange("erc")}
        >
          <p className="text-inherit text-[12.6px] font-semibold">
            ERC20 Token Txns
          </p>
        </button>
        <button
          className={classNames(
            "py-[5px] px-[9px] bg-bryt-grey-200 rounded-lg text-bryt-primary-main",
            activeTab === "nft" && "text-white bg-bryt-primary-main"
          )}
          onClick={() => onChange("nft")}
        >
          <p className="text-inherit text-[12.6px] font-semibold">
            NFT Transfers
          </p>
        </button>
        {accountType === "Contract" && (
          <>
            <button
              className={classNames(
                "py-[5px] px-[9px] bg-bryt-grey-200 rounded-lg text-bryt-primary-main",
                activeTab === "contract" && "text-white bg-bryt-primary-main"
              )}
              onClick={() => onChange("contract")}
            >
              <div className="relative inline-block">
                <p className="text-inherit text-[12.6px] font-semibold">
                  Contract
                </p>
                {addressInfo?.is_verified && (
                  <AiFillCheckCircle className="text-green-500 w-3 h-3 absolute -top-2 -right-2" />
                )}
              </div>
            </button>
            <button
              className={classNames(
                "py-[5px] px-[9px] bg-bryt-grey-200 rounded-lg text-bryt-primary-main",
                activeTab === "events" && "text-white bg-bryt-primary-main"
              )}
              onClick={() => onChange("events")}
            >
              <p className="text-inherit text-[12.6px] font-semibold">Events</p>
            </button>
          </>
        )}
        {/* <button
          className={classNames(
            "py-[5px] px-[9px] bg-bryt-grey-200 rounded-lg text-bryt-primary-main",
            activeTab === "analytics" && "text-white bg-bryt-primary-main"
          )}
          onClick={() => onChange("analytics")}
        >
          <p className="text-inherit text-[12.6px] font-semibold">Analytics</p>
        </button> */}
        <button
          className={classNames(
            "py-[5px] px-[9px] bg-bryt-grey-200 rounded-lg text-bryt-primary-main",
            activeTab === "assets" && "text-white bg-bryt-primary-main"
          )}
          onClick={() => onChange("assets")}
        >
          <p className="text-inherit text-[12.6px] font-semibold">Assets</p>
        </button>
      </div>
    </>
  );
};

export default AccountTabs;
