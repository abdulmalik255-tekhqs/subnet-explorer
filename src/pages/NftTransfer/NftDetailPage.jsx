import React, { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { shortenString } from "../../utils";
import { ITEMS_PER_PAGE } from "../../app.config";
import ClipBoardComponet from "../../components/Pagination/ClipBoard";
import ASSETS from "../../assets";
import RowsPerPageDropdown from "../../components/Pagination/PageSelector";
import Pagination from "../../components/Pagination/Pagination";
import classNames from "classnames";
import axios from "axios";
import { toast } from "react-toastify";

dayjs.extend(utc);
dayjs.extend(relativeTime);

// Skeleton Components
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const NFTImageSkeleton = () => (
  <div className="lg:col-span-1 bg-white border border-gray-200 rounded-[16px] shadow-md p-6 flex items-center justify-center">
    <Skeleton className="w-full h-[400px] rounded-lg" />
  </div>
);

const NFTDetailsSkeleton = () => (
  <div className="lg:col-span-2 bg-white border border-gray-200 rounded-[16px] shadow-md p-6">
    <Skeleton className="h-8 w-32 mb-4" />
    <div className="grid grid-cols-2 gap-y-4">
      {[...Array(8)].map((_, i) => (
        <div key={i}>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-5 w-40" />
        </div>
      ))}
    </div>
  </div>
);

const TransfersTableSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-[16px] shadow-md p-6">
    <div className="flex items-center gap-2 mb-4">
      <Skeleton className="w-6 h-6" />
      <Skeleton className="h-4 w-64" />
    </div>

    <div className="w-full overflow-auto mt-4">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-bryt-primary-main h-[38px] [&_td]:px-4">
            <td className="text-[11.5px] font-bold text-white">Txn Hash</td>
            <td className="text-[11.5px] font-bold text-white">From</td>
            <td className="text-[11.5px] font-bold text-white">To</td>
            <td className="text-[11.5px] font-bold text-white">Age</td>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, i) => (
            <tr
              key={i}
              className="h-12 [&_td]:px-4 [&_td]:border-b [&_td]:border-b-bryt-grey-200"
            >
              <td>
                <Skeleton className="h-4 w-32" />
              </td>
              <td>
                <Skeleton className="h-4 w-32" />
              </td>
              <td>
                <Skeleton className="h-4 w-32" />
              </td>
              <td>
                <Skeleton className="h-4 w-24" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const NftDetailPage = () => {
  const { id, tokenID } = useParams();
  const dispatch = useDispatch();
  const { nftDetailData, AddressPages, tokenHeight, transferByNFT, loading } =
    useSelector((state) => state.tokens);
  const [tab, setTab] = useState("transfers");
  const [page, setPage] = useState(1);
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const [limit, setLimit] = useState(ITEMS_PER_PAGE);
  const handleRowsChange = (rows) => {
    setLimit(rows);
  };
  useEffect(() => {
    const lastID = transferByNFT?.[transferByNFT?.length - 1]?.number;
    dispatch.tokens.getTransfersByNftPagination({
      address: id,
      token_id: tokenID,
      page,
      limit,
      lastID,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, tokenID, page, limit]);

  useEffect(() => {
    if (!id || !tokenID) return;
    dispatch.tokens.getNftDetailData({
      address: id.toLowerCase(),
      token_id: tokenID,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, tokenID]);

  // Extract the primitive value for precise dependency tracking
  const tokenUriResolved = nftDetailData?.token_uri_resolved;

  const getTheNftMetadata = useCallback(async () => {
    try {
      setLoadingMetadata(true);
      const res = await axios.get(
        `http://18.216.102.37:3300/v1/user/nft/metadata/${id}/${tokenID}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key":
              "sMDllcMQ0hqEmScetVc7wOqM6mX7YQ5yCSJjgZi1wZhqh4Krrl4grWBu7hMGI8st",
          },
        },
      );
      if (res) {
        dispatch.tokens.getNftDetailData({
          address: id.toLowerCase(),
          token_id: tokenID,
        });
      }
      setLoadingMetadata(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      setLoadingMetadata(false);
    }
  }, [id, tokenID, dispatch]); // Add deps to avoid stale closures

  useEffect(() => {
    if (tokenUriResolved === undefined || tokenUriResolved === null) {
      getTheNftMetadata();
    }
  }, [tokenUriResolved, getTheNftMetadata]);
  if (loading || loadingMetadata) {
    return (
      <div className="px-4 md:px-20 py-8">
        {/* Main Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-6">
          <NFTImageSkeleton />
          <NFTDetailsSkeleton />
        </div>

        {/* Tabs Skeleton */}
        <div className="m-3 inline-flex flex-wrap items-center gap-2 p-3 bg-bryt-grey-200 rounded-md">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>

        {/* Content Skeleton */}
        <TransfersTableSkeleton />
      </div>
    );
  }

  return (
    <>
      <div className="px-4 md:px-20 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* LEFT PART — NFT IMAGE */}
          <div className="lg:col-span-1 bg-white border border-gray-200 rounded-[16px] shadow-md p-6 flex items-center justify-center">
            <img
              src={
                nftDetailData?.token_uri
                  ? nftDetailData?.token_uri?.image
                  : ASSETS.nftIcon
              } // replace with actual static image
              alt="NFT"
              className="rounded-lg object-contain max-h-[400px]"
            />
          </div>

          {/* RIGHT PART — NFT DETAILS */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-[16px] shadow-md p-6">
            {/* Title */}
            <h2 className="text-xl font-semibold mb-4">
              #{nftDetailData?.number ? nftDetailData?.number : " N/A"}
            </h2>
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <p className="text-gray-500 text-sm">Blockchain</p>
                <p className="font-medium flex items-center gap-2">Ryt</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Name</p>
                <p className="font-medium">
                  {nftDetailData?.token_uri?.name ?? "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Contract Address</p>
                <p className="font-medium text-bryt-primary-main flex items-center gap-2">
                  {shortenString(
                    nftDetailData?.token_address
                      ? nftDetailData?.token_address
                      : "0x00000000000000000000000000000000",
                  ) ?? "N/A"}
                  <ClipBoardComponet
                    val={nftDetailData?.token_address}
                    message={"Contract address copied!"}
                  />
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Owner</p>
                <p className="font-medium text-bryt-primary-main">
                  {shortenString(
                    nftDetailData?.owner
                      ? nftDetailData?.owner
                      : "0x00000000000000000000000000000000",
                  ) || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Token ID</p>
                <p className="font-medium">
                  {nftDetailData?.token_id ?? "N/A"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Token Standard</p>
                <p className="font-medium">{nftDetailData?.type ?? "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Description</p>
                <p className="font-medium">
                  {nftDetailData?.token_uri?.description ?? "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Amount</p>
                <p className="font-medium">{nftDetailData?.amount ?? "N/A"}</p>
              </div>
              <div>
                {" "}
                <p className="text-gray-500 text-sm">Attributes</p>{" "}
                {nftDetailData?.token_uri ? (
                  nftDetailData?.token_uri?.attributes?.map(
                    (attribute, index) => (
                      <p key={index} className="font-medium">
                        {" "}
                        {attribute?.value}{" "}
                      </p>
                    ),
                  )
                ) : (
                  <p className="font-medium">N/A</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TRANSFERS SECTION */}
        <div className="m-3 inline-flex flex-wrap items-center gap-2 p-3 bg-bryt-grey-200 rounded-md">
          <button
            className={classNames(
              "py-[5px] px-[9px] bg-bryt-grey-200 rounded-lg text-bryt-primary-main",
              tab === "transfers" && "text-white bg-bryt-primary-main",
            )}
            onClick={() => setTab("transfers")}
          >
            <p className="text-inherit text-[12.6px] font-semibold">
              Transfers
            </p>
          </button>
          {nftDetailData?.token_uri ? (
            <>
              <button
                className={classNames(
                  "py-[5px] px-[9px] bg-bryt-grey-200 rounded-lg text-bryt-primary-main",
                  tab === "metadata" && "text-white bg-bryt-primary-main",
                )}
                onClick={() => setTab("metadata")}
              >
                <p className="text-inherit text-[12.6px] font-semibold">
                  Metadata
                </p>
              </button>
            </>
          ) : null}
        </div>
        {tab === "metadata" && nftDetailData?.token_uri ? (
          <div className="bg-white border border-gray-200 rounded-[16px] shadow-md p-6">
            {/* Pretty-printed JSON from token_uri?.raw */}
            {nftDetailData?.token_uri?.raw && (
              <div className="space-y-4">
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-xs font-mono border border-gray-200 max-h-96 overflow-y-auto">
                  {JSON.stringify(nftDetailData?.token_uri?.raw, null, 2)}
                </pre>

                {/* Image preview + URL (only shows URL in text, img uses src) */}
                {nftDetailData?.token_uri?.raw?.image && (
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">
                      Image Preview:
                    </p>
                    <img
                      src={nftDetailData?.token_uri?.raw?.image}
                      alt="NFT Preview"
                      className="w-full max-w-md h-48 object-contain border border-gray-200 rounded-lg mb-2"
                    />
                    <p className="text-xs text-gray-500 break-all font-mono">
                      URL: {nftDetailData?.token_uri?.raw?.image}
                    </p>
                  </div>
                )}
              </div>
            )}

            {!nftDetailData?.token_uri?.raw && (
              <p className="text-gray-500 italic">No metadata available.</p>
            )}
          </div>
        ) : (
          <>
            <div className="bg-white border border-gray-200 rounded-[16px] shadow-md p-6">
              <div className="flex items-center gap-2">
                <img src={ASSETS.arrowDownList} alt="" />
                <p className="text-[14.5px]">
                  Latest {transferByNFT?.length || 0} from a total of{" "}
                  <span className="text-bryt-primary-main">
                    {tokenHeight ?? 0}{" "}
                  </span>
                  Transfers
                </p>
              </div>

              {/* TABLE */}
              <div className="w-full overflow-auto mt-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-bryt-primary-main h-[38px] [&_td]:px-4">
                      <td className="text-[11.5px] font-bold text-white">
                        Txn Hash
                      </td>
                      <td className="text-[11.5px] font-bold text-white">
                        From
                      </td>
                      <td className="text-[11.5px] font-bold text-white">To</td>
                      <td className="text-[11.5px] font-bold text-white">
                        Age
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {transferByNFT?.length > 0 ? (
                      transferByNFT?.map((nft) => (
                        <tr
                          key={nft?.block_number}
                          className="h-12 [&_td]:px-4 [&_td]:border-b [&_td]:border-b-bryt-grey-200
                [&:last-of-type_td]:border-b-0 cursor-pointer"
                        >
                          <td className="text-[14.5px] text-bryt-primary-main">
                            <div className="flex gap-3">
                              <Link to={`/tx/${nft?.transaction_hash}`}>
                                <p className=" text-[12.5px] text-bryt-primary-main overflow-hidden text-ellipsis hover:underline hover:text-blue-600">
                                  {shortenString(nft?.transaction_hash)}
                                </p>
                              </Link>
                              <ClipBoardComponet
                                val={nft?.transaction_hash}
                                message={"Transaction hash copied!"}
                              />
                            </div>
                          </td>
                          <td className="text-[12.5px] text-bryt-primary-main">
                            <div className="flex gap-3">
                              <Link to={`/address/${nft?.from}`}>
                                <p
                                  className="text-[12.5px] px-2 rounded-md flex justify-start items-start w-[20ch]
                   border-2 border-transparent 
                   hover:bg-bryt-grey-200
                   hover:border-bryt-primary-main 
                   hover:border-dotted"
                                >
                                  {shortenString(nft.from) ||
                                    "0x0000000000000000000000000000000000000000"}
                                </p>
                              </Link>
                              <ClipBoardComponet
                                val={nft?.from}
                                message={"Wallet address copied!"}
                              />
                            </div>
                          </td>
                          <td className="text-[12.5px] text-bryt-primary-main">
                            <div className="flex gap-3">
                              <Link to={`/address/${nft?.to}`}>
                                <p
                                  className="text-[12.5px] px-2 rounded-md flex justify-start items-start w-[20ch]
                   border-2 border-transparent 
                   hover:bg-bryt-grey-200
                   hover:border-bryt-primary-main 
                   hover:border-dotted"
                                >
                                  {shortenString(nft.to) ||
                                    "0x0000000000000000000000000000000000000000"}
                                </p>
                              </Link>
                              <ClipBoardComponet
                                val={nft?.to}
                                message={"Wallet address copied!"}
                              />
                            </div>
                          </td>
                          <td className="text-[12.5px] text-bryt-primary-main ">
                            {dayjs(Number(nft?.timestamp)).fromNow()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="text-center py-4 text-gray-500"
                        >
                          No Transfers Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {transferByNFT &&
                transferByNFT?.length > 0 &&
                AddressPages > 0 && (
                  <div className="flex items-center justify-between py-5 px-[17px]">
                    <RowsPerPageDropdown onChange={handleRowsChange} />
                    <Pagination
                      pages={AddressPages}
                      page={page}
                      setPage={setPage}
                    />
                  </div>
                )}
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default NftDetailPage;
