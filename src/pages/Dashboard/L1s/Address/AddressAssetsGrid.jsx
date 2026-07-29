import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Pagination from "../Pagination";
import { fmtNum } from "./addressUtils";
import useKeysetPagination, { PAGE_SIZE } from "./useKeysetPagination";

const NftIcon = () => (
  <svg
    width="56"
    height="56"
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
);

const NftCard = ({ nft, chainId, navigate }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const hasImage = nft.token_uri_resolved && !imgFailed;
  return (
    <div
      onClick={() =>
        nft.token_address != null &&
        nft.token_id != null &&
        navigate(`/orbit/${chainId}/nft/${nft.token_address}/${nft.token_id}`)
      }
      className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden cursor-pointer hover:border-gray-700 transition-colors"
    >
      <div className="aspect-square flex items-center justify-center bg-[#111827]">
        {hasImage ? (
          <img
            src={nft.token_uri?.image}
            alt={`Token #${nft.token_id}`}
            className="w-full h-full object-cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <NftIcon />
        )}
      </div>
      <div className="px-3 py-2.5 border-t border-gray-800 space-y-1">
        <div className="text-[11px] text-gray-500">
          Token:{" "}
          <span
            onClick={(e) => {
              e.stopPropagation();
              nft.token_address &&
                navigate(`/orbit/${chainId}/address/${nft.token_address}`);
            }}
            className={
              nft.token_address
                ? "text-blue-400 hover:text-blue-300 cursor-pointer font-mono"
                : "text-gray-600"
            }
          >
            {hasImage ? nft.token_uri?.name : "--"}
          </span>
        </div>
        <div className="text-[11px] text-gray-500">
          TokenId: <span className="text-gray-300">{nft.token_id ?? "--"}</span>
        </div>
        <div className="text-[11px] text-gray-500">
          ChainID: <span className="text-gray-300">{nft.chain_id ?? "--"}</span>
        </div>
      </div>
    </div>
  );
};

export default function AddressAssetsGrid({ chainId, address, active }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchPage = useCallback(
    async (lastId) => {
      const data = await dispatch.orbit.handleGetNftsByAddress({
        chainId,
        address,
        lastId,
        limit: String(PAGE_SIZE),
      });
      return { items: data?.nfts ?? [], total: data?.totalNFTS };
    },
    [dispatch, chainId, address],
  );

  const { items, total, totalPages, page, loading, goToPage } =
    useKeysetPagination({ chainId, address, active, fetchPage });

  return (
    <div className="bg-[#0B111D] border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs text-gray-500">
          Latest {items.length} from a total of{" "}
          <span className="text-gray-300 font-semibold">{fmtNum(total)}</span>{" "}
          NFTs
        </span>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center text-gray-600 text-sm">
          Loading…
        </div>
      ) : items.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-gray-600 text-sm">
          No NFTs found
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5">
          {items.map((nft) => (
            <NftCard
              key={nft.id}
              nft={nft}
              chainId={chainId}
              navigate={navigate}
            />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
    </div>
  );
}
