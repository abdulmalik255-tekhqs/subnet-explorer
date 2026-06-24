import React, { useEffect } from "react";
import ASSETS from "../../assets";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AccountAssets = ({ address = "" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NFT } = useSelector((state) => state.transactions);
  useEffect(() => {
    const lowerCaseAddress = address.toLowerCase();
    dispatch.transactions.getNFTAddress({
      address: lowerCaseAddress,
    });

    // eslint-disable-next-line
  }, [address]);
  return (
    <>
      <div className="bg-white border border-bryt-grey-200 rounded-[12px] shadow-txBox mt-3 p-5">
        {NFT?.length === 0 ? (
          <p className="text-center text-bryt-grey-500">No NFT found</p>
        ) : (
          <div
            className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4 
        gap-4
      "
          >
            {NFT?.map((nft) => (
              <div
                key={nft?.token_id}
                className="bg-bryt-grey-200 rounded-md flex flex-col p-3 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() =>
                  navigate(`/nft/${nft?.token_address}/${nft?.token_id}`)
                }
              >
                <div className="flex justify-center items-center h-[150px] bg-white rounded-md">
                  <img
                    src={ASSETS.nftIcon}
                    alt="no-icon"
                    className="h-[120px] object-contain"
                  />
                </div>

                <div className="mt-2 text-sm">
                  <p className="text-bryt-grey-700">
                    <span className="font-medium">Token:</span>{" "}
                    {nft?.token_uri?.name ?? "--"}
                  </p>
                  <p className="text-bryt-grey-700">
                    <span className="font-medium">TokenId:</span>{" "}
                    {nft?.token_id}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AccountAssets;
