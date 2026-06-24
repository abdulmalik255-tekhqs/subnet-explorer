import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import { handleCopy, shortenString } from "../../utils";
import ASSETS from "../../assets";
import { useDispatch, useSelector } from "react-redux";
import { ITEMS_PER_PAGE } from "../../app.config";
import ClipBoardComponet from "../../components/Pagination/ClipBoard";
import AccountTabs from "../../components/AccountsTabs/AccountTabs";
import AccountOverview from "./AccountOverview";
import AccountInternal from "./AccountInternal";
import AccountNftTransfers from "./AccountNftTransfers";
import AccountContract from "./AccountContract";
import AccountEvents from "./AccountEvents";
import AccountAnalytics from "./AccountAnalytics";
import AccountAssets from "./AccountAssets";
import AccountERC from "./AccountERC";

const TAB_COMPONENTS = {
  transactions: AccountOverview,
  internal: AccountInternal,
  nft: AccountNftTransfers,
  contract: AccountContract,
  events: AccountEvents,
  analytics: AccountAnalytics,
  assets: AccountAssets,
  erc: AccountERC,
};

dayjs.extend(utc);
dayjs.extend(relativeTime);
const Accounts = () => {
  const address = useParams().id;
  const dispatch = useDispatch();
  const [tab, setTab] = useState("transactions");
  const {
    // transactionHeight,
    // pages,
    balance,
    addressInfo,
    loading,
    AddressTransactions,
    transactionHeightAddress,
    AddressPages,
    firstTransaction,
  } = useSelector((state) => state.transactions);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(ITEMS_PER_PAGE);

  const handleRowsChange = (rows) => {
    setLimit(rows);
  };

  useEffect(() => {
    const lowerCaseAddress = address.toLowerCase();

    dispatch.transactions.getAccountBalance({ address: lowerCaseAddress });
    dispatch.transactions.getAddressInfo({ address: lowerCaseAddress });
    dispatch.transactions.getFirstTransactionByAddress({
      address: lowerCaseAddress,
    });

    // eslint-disable-next-line
  }, [address, limit, page]);
  function roundToSixDecimals(value) {
    return Math.round(Number(value) * 1e6) / 1e6;
  }

  const ActiveTabComponent = TAB_COMPONENTS[tab] || AccountOverview;

  return (
    <div className="flex-grow bg-blocks px-20 py-5">
      <div className="flex items-center gap-2">
        <img src={ASSETS.account} className="rounded-full" alt="" />
        {loading ? (
          <>
            <div className="p-3 mb-2 bg-gray-200 animate-pulse rounded-lg flex flex-col justify-center items-center"></div>
          </>
        ) : (
          <>
            <p className="text-[14px] font-bold">
              {addressInfo?.is_contract ? "Contract" : "Address"}{" "}
            </p>
          </>
        )}

        <p className="text-[12px]">{address}</p>
        <div className="flex items-center gap-1">
          <img
            src={ASSETS.copy}
            alt=""
            className="cursor-pointer"
            onClick={() =>
              handleCopy(address, "Wallet address copied successfully")
            }
          />
          {/* <img src={ASSETS.barcode} alt="" />
          <img src={ASSETS.msg} className="self-start" alt="" /> */}
        </div>
      </div>
      <div className="border-t border-t-bryt-grey-200 mt-[19px]"></div>
      <p className="text-[12.5px] text-bryt-primary-main mt-[10px] mb-[30px]">
        Use <span className="font-bold">RYT SDK</span> for network
        communications
      </p>
      <div className="flex items-center gap-2">
        <div className="h-[26px] border bg-bryt-grey-100 rounded-3xl border-bryt-grey-200 px-2 flex items-center gap-1">
          <img src={ASSETS.tag} alt="" />
          <p className="text-[10px] font-semibold">Titan Builder</p>
          <img src={ASSETS.redirect} alt="" />
        </div>
        <div className="h-[26px] border  rounded-3xl border-bryt-grey-200 px-2 flex items-center gap-1">
          <img src={ASSETS.rite} alt="" />
          <p className="text-[10px] font-semibold">Titan Builder</p>
          <img src={ASSETS.infoGrey} alt="" />
        </div>
        <div className="h-[26px] border  rounded-3xl border-bryt-grey-200 px-2 flex items-center gap-1">
          <p className="text-[10px]">
            # <span className="font-semibold">MEV Builder</span>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-5 mt-2">
        <div className="bg-hover col-span-6 p-[17px] rounded-[12px] shadow-account">
          <p className="text-[12.5px] font-semibold">Overview</p>
          <p className="text-[12.5px] text-bryt-grey-700 mt-5 uppercase">
            RYT Balance
          </p>
          <p className="text-[14.5px]">
            {balance && roundToSixDecimals(Number(balance))} RYT
          </p>
          {/* <p className="text-[12.5px] text-bryt-grey-700 mt-5 uppercase">
            RYT Value
          </p>
          <p className="text-[14.5px]">
            $47,557.08 <span className="text-[12.5px]">(@ $3,758.86/ETH)</span>
          </p> */}
          {/* <p className="text-[12.5px] text-bryt-grey-700 mt-5 uppercase">
            Token Holdings
          </p>
          <div className="flex items-center mt-1 gap-2">
            <div className="flex-grow h-10 rounded-lg border border-bryt-grey-200 flex cursor-not-allowed bg-white items-center px-[13px] justify-between">
              <p className="text-[14.5px] text-bryt-primary-main">
                $1.19 <span className="text-[12.5px] ">(68 Tokens)</span>
              </p>
              <img src={ASSETS.arrowDown} alt="" />
            </div>
            <div className="w-10 h-10 rounded-lg border border-bryt-grey-200 grid place-items-center cursor-pointer bg-white">
              <img src={ASSETS.wallet} alt="" />
            </div>
          </div> */}
        </div>
        <div className="bg-hover col-span-6 p-[17px] rounded-[12px]  shadow-account">
          <p className="text-[12.5px] font-semibold">More Info</p>
          <p className="text-[12.5px] text-bryt-grey-700 mt-5 uppercase">
            total transactions
          </p>
          <p className="text-[14.5px] text-bryt-primary-main">
            {addressInfo && addressInfo?.total_transactions} transactions
          </p>
          {firstTransaction &&
            firstTransaction?.hash &&
            !addressInfo?.is_contract && (
              <>
                <p className="text-[12.5px] text-bryt-grey-700 mt-5 uppercase">
                  First activity
                </p>
                <p className="text-[14.5px] text-bryt-primary-main break-all">
                  <Link to={`/tx/${firstTransaction?.hash}`}>
                    {shortenString(firstTransaction?.hash)}{" "}
                  </Link>
                  <span className="text-bryt-grey-700">
                    {dayjs(Number(firstTransaction?.timestamp)).fromNow()}{" "}
                  </span>
                </p>
              </>
            )}
          {addressInfo && addressInfo?.is_contract && (
            <>
              {" "}
              <p className="text-[12.5px] text-bryt-grey-700 mt-5 uppercase">
                Contract Creators
              </p>
              <p className="text-[14.5px] text-bryt-primary-main flex gap-3 items-center">
                <Link to={`/address/${addressInfo?.creator}`}>
                  {addressInfo?.creator?.slice(0, 7)}...
                </Link>
                <ClipBoardComponet
                  val={addressInfo?.creator}
                  message={"Contract Creators address copied!"}
                />
                at txn{" "}
                <Link to={`/tx/${addressInfo?.creation_tx_hash}`}>
                  {addressInfo?.creation_tx_hash?.slice(0, 7)}...
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
      {/* table section */}
      <div className="flex items-center justify-between mt-[32px]">
        <AccountTabs
          activeTab={tab}
          accountType={addressInfo?.is_contract ? "Contract" : "Address"}
          onChange={(val) => {
            setTab(val);
          }}
        />
        {/* <div className="flex h-[29px] border border-bryt-grey-200 rounded-md cursor-not-allowed">
          <div className="flex items-center gap-1 px-2">
            <img src={ASSETS.advanceFilter} alt="" />
            <p className="text-[12.5px]">Advanced Filter</p>
          </div>
          <div className="w-[29px] grid place-items-center border-l border-l-bryt-grey-200">
            <img src={ASSETS.arrowDown} alt="" />
          </div>
        </div> */}
      </div>
      <ActiveTabComponent
        address={address}
        transactions={AddressTransactions}
        transactionHeight={transactionHeightAddress}
        pages={AddressPages}
        page={page}
        onRowsChange={handleRowsChange}
        onSetPage={setPage}
        dispatchRef={dispatch}
        addressInfo={addressInfo}
        balance={balance}
        isLoading={loading}
      />
    </div>
  );
};

export default Accounts;
