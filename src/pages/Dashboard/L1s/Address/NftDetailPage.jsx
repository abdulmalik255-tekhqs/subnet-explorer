import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import axios from "axios";
import { toast } from "react-toastify";
import { ArrowLeft } from "@phosphor-icons/react";
import Navbar from "../../DashboardComponent/Navbar";
import { CopyableValue } from "./AddressAtoms";
import { truncateHash } from "./addressUtils";
import Pagination from "../Pagination";
import useKeysetPagination, { PAGE_SIZE } from "./useKeysetPagination";
import { baseApiKey, nftMetadataUrl } from "../../../../app.config";

dayjs.extend(utc);
dayjs.extend(relativeTime);

const NftImage = ({ src }) => {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <div className="bg-[#0B111D] border border-gray-800 rounded-xl h-full min-h-[280px] flex items-center justify-center overflow-hidden">
      {showImage ? (
        <img
          src={src}
          alt="NFT"
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <svg
          width="96"
          height="96"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4b5563"
          strokeWidth="1.4"
        >
          <path d="M12 2 L21 7 V17 L12 22 L3 17 V7 Z" strokeLinejoin="round" />
          <text
            x="12"
            y="13.5"
            textAnchor="middle"
            fontSize="5.5"
            fontWeight="700"
            fill="#4b5563"
            stroke="none"
          >
            NFT
          </text>
        </svg>
      )}
    </div>
  );
};

const DetailField = ({ label, children }) => (
  <div className="min-w-0">
    <p className="text-[11px] text-gray-500 mb-1">{label}</p>
    <div className="text-sm font-medium text-gray-200 break-words">
      {children ?? "N/A"}
    </div>
  </div>
);

const TABS = ["Transfers"];

export default function NftDetailPage() {
  const { chainId, tokenAddress, tokenId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orbitNftDetail, orbitNftDetailLoading } = useSelector((s) => s.orbit);
  const [tab, setTab] = useState("Transfers");
  const [loadingMetadata, setLoadingMetadata] = useState(false);

  useEffect(() => {
    if (chainId && tokenAddress && tokenId) {
      dispatch.orbit.handleGetOrbitNftDetail({
        chainId,
        contract: tokenAddress,
        tokenId,
      });
    }
  }, [dispatch, chainId, tokenAddress, tokenId]);

  const tokenUri = orbitNftDetail?.token_uri;

  const getTheNftMetadata = useCallback(async () => {
    try {
      setLoadingMetadata(true);
      await axios.get(
        `${nftMetadataUrl}/${chainId}/${tokenAddress}/${tokenId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": baseApiKey,
          },
        },
      );
      dispatch.orbit.handleGetOrbitNftDetail({
        chainId,
        contract: tokenAddress,
        tokenId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoadingMetadata(false);
    }
  }, [chainId, tokenAddress, tokenId, dispatch]);

  useEffect(() => {
    // Wait for the initial detail fetch to land, then only hit the
    // metadata-resolution endpoint if the NFT doesn't already carry one.
    if (chainId && tokenAddress && tokenId && orbitNftDetail && !tokenUri) {
      getTheNftMetadata();
    }
  }, [
    chainId,
    tokenAddress,
    tokenId,
    orbitNftDetail,
    tokenUri,
    getTheNftMetadata,
  ]);

  const fetchTransfers = useCallback(
    async (lastId) => {
      const data = await dispatch.orbit.handleGetNftTokenTransfers({
        chainId,
        contract: tokenAddress,
        tokenId,
        lastId,
        limit: String(PAGE_SIZE),
      });
      return { items: data?.transfers ?? [], total: data?.totalTransfers };
    },
    [dispatch, chainId, tokenAddress, tokenId],
  );

  const { items, total, totalPages, page, loading, goToPage } =
    useKeysetPagination({
      chainId,
      address: `${tokenAddress}:${tokenId}`,
      active: tab === "Transfers",
      fetchPage: fetchTransfers,
    });

  const nft = orbitNftDetail;
  const metadata = nft?.token_uri;
  const hasMetadata = !!metadata;
  const tabs = hasMetadata ? TABS : TABS.filter((t) => t !== "Metadata");

  return (
    <div className="min-h-screen bg-[#060B15] text-white -m-5">
      <Navbar />

      <div className="px-6 py-5 space-y-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft size={12} /> Back
          </button>
          <span>/</span>
          <span>Chain {chainId}</span>
          <span>/</span>
          <span
            onClick={() =>
              navigate(`/subnets/${chainId}/address/${tokenAddress}`)
            }
            className="text-blue-400 hover:text-blue-300 cursor-pointer font-mono"
          >
            {truncateHash(tokenAddress)}
          </span>
          <span>/</span>
          <span className="text-gray-300">NFT #{tokenId}</span>
        </div>

        <h1 className="text-2xl font-bold text-white">NFT #{tokenId}</h1>

        {(orbitNftDetailLoading && !nft) || loadingMetadata ? (
          <div className="h-64 flex items-center justify-center text-gray-600 text-sm">
            Loading NFT…
          </div>
        ) : !nft ? (
          <div className="h-64 flex items-center justify-center text-gray-600 text-sm">
            NFT not found
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
              <div className="lg:col-span-1">
                <NftImage src={metadata?.image} />
              </div>

              <div className="lg:col-span-2 bg-[#0B111D] border border-gray-800 rounded-xl p-5">
                <h2 className="text-lg font-bold text-white mb-4">
                  #{nft?.token_id ?? tokenId}
                </h2>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <DetailField label="Blockchain">Chain {chainId}</DetailField>
                  <DetailField label="Name">{metadata?.name}</DetailField>
                  <DetailField label="Contract Address">
                    <CopyableValue
                      value={nft?.token_address}
                      onClick={() =>
                        nft?.token_address &&
                        navigate(
                          `/subnets/${chainId}/address/${nft.token_address}`,
                        )
                      }
                    />
                  </DetailField>
                  <DetailField label="Owner">
                    <CopyableValue
                      value={nft?.owner}
                      onClick={() =>
                        nft?.owner &&
                        navigate(`/subnets/${chainId}/address/${nft.owner}`)
                      }
                    />
                  </DetailField>
                  <DetailField label="Token ID">
                    {nft?.token_id ?? tokenId}
                  </DetailField>
                  <DetailField label="Token Standard">{nft?.type}</DetailField>
                  <DetailField label="Description">
                    {metadata?.description}
                  </DetailField>
                  <DetailField label="Amount">{nft?.amount}</DetailField>
                  <DetailField label="Attributes">
                    {metadata?.attributes?.length
                      ? metadata.attributes.map((attr, i) => (
                          <p key={i}>{attr?.value}</p>
                        ))
                      : null}
                  </DetailField>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-0 border-b border-gray-800/60">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                    tab === t
                      ? "text-white border-blue-500"
                      : "text-gray-500 border-transparent hover:text-gray-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {tab === "Metadata" && hasMetadata ? (
              <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden p-5 space-y-4">
                {metadata?.raw ? (
                  <pre className="bg-[#111827] border border-gray-800 p-4 rounded-lg overflow-x-auto text-xs font-mono text-gray-300 max-h-96 overflow-y-auto">
                    {JSON.stringify(metadata.raw, null, 2)}
                  </pre>
                ) : (
                  <p className="text-gray-600 text-sm italic">
                    No metadata available.
                  </p>
                )}
                {metadata?.raw?.image && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Image Preview:</p>
                    <img
                      src={metadata.raw.image}
                      alt="NFT preview"
                      className="w-full max-w-md h-48 object-contain border border-gray-800 rounded-lg mb-2"
                    />
                    <p className="text-xs font-mono text-gray-600 break-all">
                      URL: {metadata.raw.image}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs text-gray-500">
                    Latest {items.length} from a total of{" "}
                    <span className="text-gray-300 font-semibold">{total}</span>{" "}
                    Transfers
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-800/60">
                        <th className="text-left px-5 py-2.5 text-gray-500 font-medium">
                          Txn Hash
                        </th>
                        <th className="text-left px-3 py-2.5 text-gray-500 font-medium">
                          From
                        </th>
                        <th className="text-left px-3 py-2.5 text-gray-500 font-medium">
                          To
                        </th>
                        <th className="text-right px-5 py-2.5 text-gray-500 font-medium">
                          Age
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="text-center py-10 text-gray-600 text-xs"
                          >
                            Loading…
                          </td>
                        </tr>
                      ) : items.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="text-center py-10 text-gray-600 text-xs"
                          >
                            No Transfers Found
                          </td>
                        </tr>
                      ) : (
                        items.map((row, i) => {
                          const txHash = row.transaction_hash?.split("-").pop();
                          return (
                            <tr
                              key={row.id ?? i}
                              className={`border-b border-gray-800/40 hover:bg-white/[0.02] transition-colors ${
                                i === items.length - 1 ? "border-0" : ""
                              }`}
                            >
                              <td className="px-5 py-2.5">
                                <span
                                  onClick={() =>
                                    navigate(`/subnets/${chainId}/tx/${txHash}`)
                                  }
                                  className="text-blue-400 font-mono hover:text-blue-300 cursor-pointer"
                                >
                                  {truncateHash(txHash)}
                                </span>
                              </td>
                              <td className="px-3 py-2.5 font-mono text-gray-300">
                                <span
                                  onClick={() =>
                                    navigate(
                                      `/subnets/${chainId}/address/${row.from}`,
                                    )
                                  }
                                  className="hover:text-blue-300 cursor-pointer"
                                >
                                  {truncateHash(row.from)}
                                </span>
                              </td>
                              <td className="px-3 py-2.5 font-mono text-gray-300">
                                <span
                                  onClick={() =>
                                    navigate(
                                      `/subnets/${chainId}/address/${row.to}`,
                                    )
                                  }
                                  className="hover:text-blue-300 cursor-pointer"
                                >
                                  {truncateHash(row.to)}
                                </span>
                              </td>
                              <td className="px-5 py-2.5 text-right text-gray-500">
                                {row.timestamp
                                  ? dayjs(Number(row.timestamp)).fromNow()
                                  : "—"}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
