import React, { useEffect, useState } from "react";
import { MdCancel } from "react-icons/md";

import { Link, useParams } from "react-router-dom";
import ASSETS from "../../assets";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import { shortenString, formatTokenAmount } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import ClipBoardComponet from "../../components/Pagination/ClipBoard";
import { Clock } from "@phosphor-icons/react";

dayjs.extend(utc);
dayjs.extend(relativeTime);

const InputDataSection = ({ transaction }) => {
  const [viewType, setViewType] = useState("default");
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-12">
      {/* Label */}
      <div className="col-span-3 flex items-center gap-1">
        <img src={ASSETS.infoGrey} className="w-[14.5px]" alt="" />
        <p className="text-[14.5px] text-bryt-grey-700">Input Data:</p>
      </div>

      {/* Content */}
      <div className="col-span-9 relative">
        {/* View Input As */}
        <div className="flex justify-end mb-2">
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="text-xs px-3 py-1.5 border border-bryt-grey-300 rounded-md bg-white hover:bg-gray-50"
            >
              View Input As ▾
            </button>

            {open && (
              <div className="absolute right-0 mt-1 w-[150px] bg-white border border-bryt-grey-200 rounded-md shadow-md z-20">
                <button
                  onClick={() => {
                    setViewType("default");
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-100 ${
                    viewType === "default"
                      ? "text-red-500 font-semibold"
                      : "text-gray-700"
                  }`}
                >
                  Default View
                </button>

                <button
                  onClick={() => {
                    setViewType("original");
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-100 ${
                    viewType === "original"
                      ? "text-red-500 font-semibold"
                      : "text-gray-700"
                  }`}
                >
                  Original
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Textarea */}
        <textarea
          rows="5"
          readOnly
          disabled
          value={
            viewType === "default"
              ? `Function: ${
                  transaction?.function_name || "N/A"
                }\n\nArguments:\n${JSON.stringify(
                  transaction?.function_args,
                  null,
                  2,
                )}`
              : transaction?.input || ""
          }
          className="block p-2.5 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 font-mono"
        />
      </div>
    </div>
  );
};

const TransactionOverviewDetails = () => {
  const disptach = useDispatch();
  const transaction = useSelector((state) => state.transactions.transaction);

  const txHash = useParams().id;
  const handleGetTransaction = async () => {
    try {
      disptach.transactions.getSingleTransaction(txHash);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (txHash) {
      handleGetTransaction();
      const interval = setInterval(() => {
        handleGetTransaction();
      }, 3000);

      return () => clearInterval(interval); // Cleanup on unmount
    }
    // eslint-disable-next-line
  }, [txHash]);
  const formattedTime = dayjs.utc(Number(transaction?.timestamp)); // convert from string to number

  const displayTime = `${formattedTime.fromNow()} (${formattedTime.format(
    "MMM-DD-YYYY hh:mm:ss A [UTC]",
  )})`;

  return (
    <>
      <div className="bg-white px-[9px] py-5 border border-bryt-grey-200 rounded-[12px] shadow-txBox mt-3">
        <div className="flex flex-col gap-[15px] px-2">
          <div className="w-full grid grid-cols-1 md:grid-cols-12">
            <div className="col-span-3 flex items-center gap-1">
              <img src={ASSETS.infoGrey} className="w-[14.5px]" alt="" />
              <p className="text-[14.5px] text-bryt-grey-700">
                Transaction Hash:
              </p>
            </div>
            <div className="col-span-9">
              <div className="flex items-center gap-1">
                <p className="text-[14.5px] break-all">{transaction?.hash}</p>
                <ClipBoardComponet
                  val={transaction?.hash}
                  message={"Transaction Hash Copied!"}
                />
                {/* <img
                      src={ASSETS.copy}
                      className="cursor-pointer"
                      alt=""
                      onClick={() =>
                        handleCopy(txHash, "Transaction Hash Copied")
                      }
                    /> */}
              </div>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-12">
            <div className="col-span-3 flex items-center gap-1">
              <img src={ASSETS.infoGrey} className="w-[14.5px]" alt="" />
              <p className="text-[14.5px] text-bryt-grey-700">Status:</p>
            </div>
            <div className="col-span-9 flex">
              {transaction?.transaction_status === "Success" ? (
                <div className="flex items-center gap-1 border border-green-400 bg-green-100 px-2 py-[5px] rounded-[6px]">
                  <img src={ASSETS.check} alt="" />
                  <p className="text-[11px] font-semibold text-bryt-green">
                    {transaction?.transaction_status}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-1 border border-red-400 bg-red-100 px-2 py-[5px] rounded-[6px]">
                  <MdCancel color="#dc3545" size={13} />
                  <p className="text-[11px] font-semibold text-bryt-red">
                    {transaction?.transaction_status}
                  </p>
                </div>
              )}
            </div>

            {/* <div className="flex justify-center items-center gap-1 border border-green-400 bg-green-100 px-2 py-[5px] rounded-[6px]">
                  <img src={ASSETS.check} alt="" />
                  <p className="text-[11px] font-semibold text-bryt-green">
                    {transaction?.transaction_status}
                  </p>
                </div> */}
          </div>
          {/* <div className="w-full grid grid-cols-1 md:grid-cols-12">
                <div className="col-span-3 flex items-center gap-1">
                  <img src={ASSETS.infoGrey} className="w-[14.5px]" alt="" />
                  <p className="text-[14.5px] text-bryt-grey-700">Type:</p>
                </div>

                <div className="flex items-center gap-1">
                  <p className="text-[14.5px] break-all">
                    {transaction?.transaction_type}
                  </p>
                </div>
              </div> */}
          {/* <div className="w-full grid grid-cols-12">
                <div className="col-span-3 flex items-center gap-1">
                  <img src={ASSETS.infoGrey} className="w-[14.5px]" alt="" />
                  <p className="text-[14.5px] text-bryt-grey-700"> Status:</p>
                </div>
                <div className="col-span-9 flex">
                  {transaction?.transactionStatus === "Unconfirmed" ||
                  transaction?.transactionStatus === "Balloted" ? (
                    <div className="flex items-center gap-1 border border-red-400 bg-red-100 px-2 py-[5px] rounded-[6px]">
                      <MdCancel color="#dc3545" size={13} />
                      <p className="text-[11px] font-semibold text-bryt-red">
                        Unconfirmed
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 border border-green-400 bg-green-100 px-2 py-[5px] rounded-[6px]">
                      <img src={ASSETS.check} alt="" />
                      <p className="text-[11px] font-semibold text-bryt-green">
                        Confirmed
                      </p>
                    </div>
                  )}
                </div>
              </div> */}
          <div className="w-full grid grid-cols-12">
            <div className="col-span-3 flex items-center gap-1">
              <img src={ASSETS.infoGrey} className="w-[14.5px]" alt="" />
              <p className="text-[14.5px] text-bryt-grey-700">Block:</p>
            </div>
            <div className="col-span-9">
              <div className="flex items-center gap-2">
                <img src={ASSETS.hourGlass} alt="" />
                <p className="text-[14.5px] text-bryt-primary-main">
                  {transaction?.block}
                </p>
                {/* <div className='flex items-center gap-1 border border-bryt-grey-200 bg-bryt-grey-100 px-2 py-[5px] rounded-[6px]'>
                      <p className='text-[11px] font-semibold'>
                        0 Block Confirmations
                      </p>
                    </div> */}
              </div>
            </div>
          </div>
          {/* <div className="w-full grid grid-cols-12">
                <div className="col-span-3 flex items-center gap-1">
                  <img src={ASSETS.infoGrey} className="w-[14.5px]" alt="" />
                  <p className="text-[14.5px] text-bryt-grey-700">
                    {' '}
                    Timestamp:
                  </p>
                </div>
                <div className="col-span-9">
                  <div className="flex items-center gap-1">
                    <img src={ASSETS.clock} alt="" />
                    <p className="text-[14.5px]">
                      {dayjs.utc(transaction?.transaction_time).fromNow()} (
                      {transaction?.transaction_time})
                    </p>
                  </div>
                </div>
              </div> */}
          <div className="border-t border-t-bryt-grey-200 my-[5px]"></div>
          <div className="w-full grid grid-cols-1 md:grid-cols-12">
            <div className="col-span-3 flex items-center gap-1">
              <img src={ASSETS.volt} className="w-[14.5px]" alt="" />
              <p className="text-[14.5px] text-bryt-grey-700"> Timestamp:</p>
            </div>
            <div className="col-span-9">
              <div className="flex items-center gap-1">
                <Clock size={20} />
                {displayTime}
                <p className="text-[14.5px]">
                  {/* <span className="text-bryt-grey-700">Transfer</span>{" "}
                      {transaction?.value &&
                        ethers.formatEther(
                          normalizeValue(transaction?.value)
                        )}{" "}
                      <span className="font-bold">RYT</span>{" "}
                      <span className="text-bryt-grey-700">To</span>{" "}
                      <Link to={`/address/${transaction?.to}`}>
                        <span className="text-bryt-primary-main  break-words max-w-[50ch] break-all">
                          {transaction?.to?.length > 50
                            ? shortenString(transaction?.to)
                            : transaction?.to}
                        </span>
                      </Link> */}
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-t-bryt-grey-200 my-[5px]"></div>
          <div className="w-full grid grid-cols-1 md:grid-cols-12">
            <div className="col-span-3 flex items-center gap-1">
              <img src={ASSETS.infoGrey} className="w-[14.5px]" alt="" />
              <p className="text-[14.5px] text-bryt-grey-700"> From:</p>
            </div>
            <div className="col-span-9">
              <div className="flex items-center gap-1">
                <img src={ASSETS.rite} alt="" />
                <p className="text-bryt-primary-main text-[14.5px] break-all">
                  <Link
                    to={`/address/${transaction?.from}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      disptach.transactions.setAddressTransaction([]);
                    }}
                  >
                    {transaction?.from}
                  </Link>
                </p>
                <ClipBoardComponet
                  val={transaction?.from}
                  message={"Wallet address copied!"}
                />
                {/* <img
                      src={ASSETS.copy}
                      className="cursor-pointer"
                      alt=""
                      onClick={() =>
                        handleCopy(transaction?.from, 'Wallet address copied!')
                      }
                    /> */}
              </div>
            </div>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-12">
            <div className="col-span-3 flex items-center gap-1">
              <img src={ASSETS.infoGrey} className="w-[14.5px]" alt="" />
              <p className="text-[14.5px] text-bryt-grey-700"> To:</p>
            </div>
            <div className="col-span-9">
              <div className="flex items-center gap-1">
                <img src={ASSETS.draft} alt="" />
                <p className="text-bryt-primary-main text-[14.5px] break-all">
                  <Link
                    to={`/address/${transaction?.to}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      disptach.transactions.setAddressTransaction([]);
                    }}
                  >
                    {transaction?.to?.length > 50
                      ? shortenString(transaction?.to)
                      : transaction?.to}
                  </Link>
                </p>
                <ClipBoardComponet
                  val={transaction?.to}
                  message={"Wallet address copied!"}
                />
                {/* <img
                      src={ASSETS.copy}
                      alt=""
                      className="cursor-pointer"
                      onClick={() =>
                        handleCopy(transaction?.to, "Wallet address copied!")
                      }
                    /> */}
                <img src={ASSETS.check} alt="" />
              </div>
            </div>
          </div>
          <div className="border-t border-t-bryt-grey-200 my-[5px]"></div>
          <div className="w-full grid grid-cols-1 md:grid-cols-12">
            <div className="col-span-3 flex items-center gap-1">
              <img src={ASSETS.infoGrey} className="w-[14.5px]" alt="" />
              <p className="text-[14.5px] text-bryt-grey-700"> Value:</p>
            </div>
            <div className="col-span-9">
              <p className="text-[14.5px]">
                {transaction?.value && formatTokenAmount(transaction?.value)}{" "}
                RYT{" "}
                {/* <span className="text-bryt-grey-700">($807.79)</span> */}
              </p>
            </div>
          </div>
          {/* <div className="w-full grid grid-cols-1 md:grid-cols-12">
                <div className="col-span-3 flex items-center gap-1">
                  <img src={ASSETS.infoGrey} className="w-[14.5px]" alt="" />
                  <p className="text-[14.5px] text-bryt-grey-700">
                    {" "}
                    Transaction Fee:
                  </p>
                </div>
                <div className="col-span-9">
                  <p className="text-[14.5px]">
                    {`${ethers.formatEther(
                      Number(transaction?.gas || 0) *
                        Number(transaction?.gasPrice || 0)
                    )} RYT`}
                  </p>
                </div>
              </div> */}
          {/* <div className="w-full grid grid-cols-1 md:grid-cols-12">
                <div className="col-span-3 flex items-center gap-1">
                  <img src={ASSETS.infoGrey} className="w-[14.5px]" alt="" />
                  <p className="text-[14.5px] text-bryt-grey-700">
                    {" "}
                    Gas Price:
                  </p>
                </div>
                <div className="col-span-9">
                  <p className="text-[14.5px]">
                    {`${ethers.formatUnits(
                      transaction?.gasPrice ? transaction?.gasPrice : 0,
                      "gwei"
                    )} Gwei`}
                  </p>
                </div>
              </div> */}
          <div className="border-t border-t-bryt-grey-200 my-[5px]"></div>
          <div className="w-full grid grid-cols-1 md:grid-cols-12">
            <div className="col-span-3 flex items-center gap-1">
              <img src={ASSETS.infoGrey} className="w-[14.5px]" alt="" />
              <p className="text-[14.5px] text-bryt-grey-700">
                Other Attributes:
              </p>
            </div>

            <div className="col-span-9 flex gap-2">
              <div className="flex items-center gap-1 border border-gray-200 bg-gray-50 px-2 py-[5px] rounded-[6px]">
                <p className="text-[11px] font-semibold text-bryt-grey-700">
                  Txn Type:
                </p>
                <p className="text-[11px] font-semibold">{transaction?.type}</p>
              </div>
              <div className="flex items-center gap-1 border border-gray-200 bg-gray-50 px-2 py-[5px] rounded-[6px]">
                <p className="text-[11px] font-semibold">
                  {transaction?.transaction_type}
                </p>
              </div>
              {/* <div className="flex items-center gap-1 border border-gray-200 bg-gray-50 px-2 py-[5px] rounded-[6px]">
                    <p className="text-[11px] font-semibold text-bryt-grey-700">
                      Nonce:
                    </p>
                    <p className="text-[11px] font-semibold">
                      {transaction?.nonce}
                    </p>
                  </div> */}
              {/* {transaction?.type === "2" && (
                    <div className="flex items-center gap-1 border border-gray-200 bg-gray-50 px-2 py-[5px] rounded-[6px]">
                      <p className="text-[11px] font-semibold text-bryt-grey-700">
                        Native Token Transfer
                      </p>
                    </div>
                  )}
                  {transaction?.type === "3" && (
                    <div className="flex items-center gap-1 border border-gray-200 bg-gray-50 px-2 py-[5px] rounded-[6px]">
                      <p className="text-[11px] font-semibold text-bryt-grey-700">
                        Contract Interaction
                      </p>
                    </div>
                  )} */}
            </div>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-12">
            <div className="col-span-3 flex items-center gap-1">
              <img src={ASSETS.infoGrey} className="w-[14.5px]" alt="" />
              <p className="text-[14.5px] text-bryt-grey-700">Nonce:</p>
            </div>

            <div className="col-span-9 flex gap-2">
              <div className="flex items-center gap-1 border border-gray-200 bg-gray-50 px-2 py-[5px] rounded-[6px]">
                <p className="text-[11px] font-semibold">
                  {transaction?.nonce}
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-t-bryt-grey-200 my-[5px]"></div>
          <InputDataSection transaction={transaction} />
        </div>
      </div>
      <div className="bg-white px-[9px] py-5 border border-bryt-grey-200 rounded-[12px] shadow-txBox mt-[14px]">
        <div className="w-full grid grid-cols-12 px-2">
          <div className="col-span-3 flex items-center gap-1">
            <img src={ASSETS.infoGrey} className="w-[14.5px]" alt="" />
            <p className="text-[14.5px] text-bryt-grey-700">Private Note:</p>
          </div>
          <div className="col-span-9">
            <p className="text-[14.5px]">
              To access the <span className="font-semibold">Private Note</span>{" "}
              feature, you must be{" "}
              <span className="text-bryt-primary-main">Logged In</span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-start gap-[14.5px] mt-[14px]">
        <img src={ASSETS.bulb} alt="" />
        <p className="text-[11.5px] text-bryt-grey-700">
          Blocks are batches of transactions linked via cryptographic hashes.
          Any tampering of a block would invalidate all following blocks as all
          subsequent hashes would change. Learn more about this page in our{" "}
          <span className="text-bryt-primary-main">Knowledge Base</span>
        </p>
      </div>
    </>
  );
};
export default TransactionOverviewDetails;
