import { createModel } from "@rematch/core";
import { graphqlClient } from "../../apolloClient";
import {
  GET_ERC_TOKEN_OVERALL,
  GET_NFT_DETAIL_DATA,
  GET_NFT_MINTS,
  GET_NFT_TRANSFERS_OVERALL,
  GET_TOP_ACCOUNTS,
  GET_TRANSFER_BY_NFT,
  GET_VERFIED_SIGNATURES,
  GET_VERIFIED_CONTRACTS,
} from "../../queries";

export const tokens = createModel()({
  name: "tokens",
  state: {
    loading: false,
    tokenHeight: 0,
    pages: 0,
    AddressPages: 0,
    erctoken: [],
    nftTransfers: [],
    nftMint: [],
    transferByNFT: [],
    verfiedSignatures: [],
    verfiedContracts: [],
    deployedContractsInfromation: {},
    nftDetailData: {},
  },
  reducers: {
    setLoading(state, payload) {
      state.loading = payload;
    },

    setTokenHeight(state, payload) {
      state.tokenHeight = payload;
    },
    setAddressPages(state, payload) {
      state.AddressPages = payload;
    },
    setERCTokens(state, payload) {
      state.erctoken = payload;
    },
    setNftTransfers(state, payload) {
      state.nftTransfers = payload;
    },
    setNftMint(state, payload) {
      state.nftMint = payload;
    },
    setVerfiedSignatures(state, payload) {
      state.verfiedSignatures = payload;
    },
    setVerfiedContracts(state, payload) {
      state.verfiedContracts = payload;
    },
    setContractInformation(state, payload) {
      state.deployedContractsInfromation = payload;
    },
    setNftDetailData(state, payload) {
      state.nftDetailData = payload;
    },
    setTransferByNFT(state, payload) {
      state.transferByNFT = payload;
    },
  },
  effects: (dispatch) => ({
    async getTransactionByAddressERCWithPagination(
      { page, limit, lastID },
      rootState
    ) {
      try {
        dispatch.tokens.setLoading(true);

        let lastIdToUse = "0";

        // 🧩 Page 1 → start from latest
        if (page === 1) {
          lastIdToUse = "0";
        }
        // 🧩 Sequential navigation (next page) → use previous page’s last tx id
        else if (lastID) {
          lastIdToUse = String(lastID);
        }
        // 🧩 Jump directly to Nth page → approximate starting id if we know total height
        else if (page > 1 && rootState.tokens.tokenHeight) {
          const totalTxs = Number(rootState.tokens.tokenHeight);
          const targetOffset = (page - 1) * Number(limit);
          const targetId = totalTxs - targetOffset;
          lastIdToUse = targetId > 0 ? String(targetId) : "0";
        }

        // 🧠 Make the API request
        const response = await graphqlClient.request(GET_ERC_TOKEN_OVERALL, {
          lastId: lastIdToUse,
          limit: String(limit),
        });
        const txData = response?.erc20TokenTxs || {};
        const transfers = txData?.transfers || [];
        if (transfers.length > 0) {
          const totalTxs = Number(txData?.totalTransfers || 0);
          const totalPages = Math.ceil(totalTxs / limit);

          // Save updated meta info
          dispatch.tokens.setTokenHeight(totalTxs);
          dispatch.tokens.setAddressPages(totalPages);

          // Replace tokens for the current page
          dispatch.tokens.setERCTokens(transfers);

          // ✅ Return last transaction ID (so caller can use it for next page)
          return transfers[transfers.length - 1]?.number;
        }
      } catch (err) {
        console.error(
          "Error fetching address tokens with pagination:",
          err.message
        );
      } finally {
        dispatch.tokens.setLoading(false);
      }
    },
    async getNFTTransfersWithPagination({ page, limit, lastID }, rootState) {
      try {
        dispatch.tokens.setLoading(true);

        // 💥 FIX: Reset stale cached value for Page 1
        if (page === 1) {
          dispatch.tokens.setTokenHeight(null);
        }

        let lastIdToUse = "0";

        // 1️⃣ Page 1 → start from latest
        if (page === 1) {
          lastIdToUse = "0";
        }
        // 2️⃣ Sequential next page → use lastID from previous result
        else if (lastID) {
          lastIdToUse = String(lastID);
        }
        // 3️⃣ Jump directly → use cached total height (ONLY if NOT stale)
        else if (page > 1 && rootState.tokens.tokenHeight) {
          const totalTxs = Number(rootState.tokens.tokenHeight);
          const targetOffset = (page - 1) * Number(limit);
          const targetId = totalTxs - targetOffset;
          lastIdToUse = targetId > 0 ? String(targetId) : "0";
        }

        // API call
        const response = await graphqlClient.request(
          GET_NFT_TRANSFERS_OVERALL,
          {
            lastId: lastIdToUse,
            limit: String(limit),
          }
        );
        const txData = response?.nftTransfers || {};
        const transfers = txData?.transfers || [];

        if (transfers.length > 0) {
          const totalTxs = Number(txData?.totalTransfers || 0);
          const totalPages = Math.ceil(totalTxs / limit);

          // Save updated meta info
          dispatch.tokens.setTokenHeight(totalTxs);
          dispatch.tokens.setAddressPages(totalPages);

          // Replace data
          dispatch.tokens.setNftTransfers(transfers);

          // Return last ID
          return transfers[transfers.length - 1]?.number;
        }
      } catch (err) {
        console.error("Error fetching NFT transfers:", err.message);
      } finally {
        dispatch.tokens.setLoading(false);
      }
    },
    async getNFTMintWithPagination(
      { address, page, limit, lastID },
      rootState
    ) {
      try {
        dispatch.tokens.setLoading(true);

        // 💥 FIX: Reset stale cached value for Page 1
        if (page === 1) {
          dispatch.tokens.setTokenHeight(null);
        }

        let lastIdToUse = "0";

        // 1️⃣ Page 1 → start from latest
        if (page === 1) {
          lastIdToUse = "0";
        }
        // 2️⃣ Sequential next page → use lastID from previous result
        else if (lastID) {
          lastIdToUse = String(lastID);
        }
        // 3️⃣ Jump directly → use cached total height (ONLY if NOT stale)
        else if (page > 1 && rootState.tokens.tokenHeight) {
          const totalTxs = Number(rootState.tokens.tokenHeight);
          const targetOffset = (page - 1) * Number(limit);
          const targetId = totalTxs - targetOffset;
          lastIdToUse = targetId > 0 ? String(targetId) : "0";
        }

        // API call
        const response = await graphqlClient.request(GET_NFT_MINTS, {
          lastId: lastIdToUse,
          limit: String(limit),
        });

        const txData = response?.nftMints || {};
        const transfers = txData?.transfers || [];

        if (transfers.length > 0) {
          const totalTxs = Number(txData?.totalTransfers || 0);
          const totalPages = Math.ceil(totalTxs / limit);

          // Save updated meta info
          dispatch.tokens.setTokenHeight(totalTxs);
          dispatch.tokens.setAddressPages(totalPages);

          // Replace data
          dispatch.tokens.setNftMint(transfers);

          // Return last ID
          return transfers[transfers.length - 1]?.number;
        }
      } catch (err) {
        console.error("Error fetching NFT transfers:", err.message);
      } finally {
        dispatch.tokens.setLoading(false);
      }
    },
    async getVerifiedSigntauresWithPagination(
      { address, page, limit, lastID },
      rootState
    ) {
      try {
        dispatch.tokens.setLoading(true);

        // 💥 FIX: Reset stale cached value for Page 1
        if (page === 1) {
          dispatch.tokens.setTokenHeight(null);
        }

        let lastIdToUse = "0";

        // 1️⃣ Page 1 → start from latest
        if (page === 1) {
          lastIdToUse = "0";
        }
        // 2️⃣ Sequential next page → use lastID from previous result
        else if (lastID) {
          lastIdToUse = String(lastID);
        }
        // 3️⃣ Jump directly → use cached total height (ONLY if NOT stale)
        else if (page > 1 && rootState.tokens.tokenHeight) {
          const totalTxs = Number(rootState.tokens.tokenHeight);
          const targetOffset = (page - 1) * Number(limit);
          const targetId = totalTxs - targetOffset;
          lastIdToUse = targetId > 0 ? String(targetId) : "0";
        }

        // API call
        const response = await graphqlClient.request(GET_VERFIED_SIGNATURES, {
          lastId: lastIdToUse,
          limit: String(limit),
        });

        const txData = response?.verifiedContracts || {};
        const transfers = txData?.verifiedContracts || [];

        if (transfers.length > 0) {
          const totalTxs = Number(txData?.totalVerifiedContracts || 0);
          const totalPages = Math.ceil(totalTxs / limit);

          // Save updated meta info
          dispatch.tokens.setTokenHeight(totalTxs);
          dispatch.tokens.setAddressPages(totalPages);

          // Replace data
          dispatch.tokens.setVerfiedSignatures(transfers);

          // Return last ID
          return transfers[transfers.length - 1]?.number;
        }
      } catch (err) {
        console.error("Error fetching NFT transfers:", err.message);
      } finally {
        dispatch.tokens.setLoading(false);
      }
    },
    async getVerifiedContract({ page, limit, lastID }, rootState) {
      try {
        dispatch.tokens.setLoading(true);

        // 💥 FIX: Reset stale cached value for Page 1
        if (page === 1) {
          dispatch.tokens.setTokenHeight(null);
        }

        let lastIdToUse = "0";

        // 1️⃣ Page 1 → start from latest
        if (page === 1) {
          lastIdToUse = "0";
        }
        // 2️⃣ Sequential next page → use lastID from previous result
        else if (lastID) {
          lastIdToUse = String(lastID);
        }
        // 3️⃣ Jump directly → use cached total height (ONLY if NOT stale)
        else if (page > 1 && rootState.tokens.tokenHeight) {
          const totalTxs = Number(rootState.tokens.tokenHeight);
          const targetOffset = (page - 1) * Number(limit);
          const targetId = totalTxs - targetOffset;
          lastIdToUse = targetId > 0 ? String(targetId) : "0";
        }

        // API call
        const response = await graphqlClient.request(GET_VERIFIED_CONTRACTS, {
          lastId: lastIdToUse,
          limit: String(limit),
        });

        const txData = response?.verifiedContracts || {};
        const transfers = txData?.verifiedContracts || [];

        if (transfers.length > 0) {
          const totalTxs = Number(txData?.totalVerifiedContracts || 0);
          const totalPages = Math.ceil(totalTxs / limit);

          // Save updated meta info
          dispatch.tokens.setTokenHeight(totalTxs);
          dispatch.tokens.setAddressPages(totalPages);
          dispatch.tokens.setContractInformation(
            response?.verifiedContracts || {}
          );
          // Replace data
          dispatch.tokens.setVerfiedContracts(transfers);

          // Return last ID
          return transfers[transfers.length - 1]?.number;
        } else {
          dispatch.tokens.setVerfiedContracts([]);
        }
      } catch (err) {
        console.error("Error fetching NFT transfers:", err.message);
      } finally {
        dispatch.tokens.setLoading(false);
      }
    },
    async getTopAccounts({ page, limit, lastID }, rootState) {
      try {
        dispatch.tokens.setLoading(true);

        // 💥 FIX: Reset stale cached value for Page 1
        if (page === 1) {
          dispatch.tokens.setTokenHeight(null);
        }

        let lastIdToUse = "0";

        // 1️⃣ Page 1 → start from latest
        if (page === 1) {
          lastIdToUse = "0";
        }
        // 2️⃣ Sequential next page → use lastID from previous result
        else if (lastID) {
          lastIdToUse = String(lastID);
        }
        // 3️⃣ Jump directly → use cached total height (ONLY if NOT stale)
        else if (page > 1 && rootState.tokens.tokenHeight) {
          const totalTxs = Number(rootState.tokens.tokenHeight);
          const targetOffset = (page - 1) * Number(limit);
          const targetId = totalTxs - targetOffset;
          lastIdToUse = targetId > 0 ? String(targetId) : "0";
        }

        // API call
        const response = await graphqlClient.request(GET_TOP_ACCOUNTS, {
          lastId: lastIdToUse,
          limit: String(limit),
        });

        const txData = response?.topAccounts || {};
        const transfers = txData?.accounts || [];

        if (transfers.length > 0) {
          const totalTxs = Number(txData?.totalAccounts || 0);
          const totalPages = Math.ceil(totalTxs / limit);

          // Save updated meta info
          dispatch.tokens.setTokenHeight(totalTxs);
          dispatch.tokens.setAddressPages(totalPages);

          // Replace data
          dispatch.tokens.setVerfiedContracts(transfers);

          // Return last ID
          return transfers[transfers.length - 1]?.number;
        }
      } catch (err) {
        console.error("Error fetching NFT transfers:", err.message);
      } finally {
        dispatch.tokens.setLoading(false);
      }
    },
    async getNftDetailData({ address, token_id }) {
      try {
        dispatch.tokens.setLoading(true);

        const response = await graphqlClient.request(GET_NFT_DETAIL_DATA, {
          contract: address,
          tokenId: String(token_id),
        });
        dispatch.tokens.setNftDetailData(response?.nft || {});
      } catch (err) {
        console.error("Error fetching NFT detail data:", err?.message || err);
      } finally {
        dispatch.tokens.setLoading(false);
      }
    },
    async getTransfersByNftPagination(
      { address, token_id, page, limit, lastID },
      rootState
    ) {
      try {
        dispatch.tokens.setLoading(true);

        // 💥 FIX: Reset stale cached value for Page 1
        if (page === 1) {
          dispatch.tokens.setTokenHeight(null);
        }

        let lastIdToUse = "0";

        // 1️⃣ Page 1 → start from latest
        if (page === 1) {
          lastIdToUse = "0";
        }
        // 2️⃣ Sequential next page → use lastID from previous result
        else if (lastID) {
          lastIdToUse = String(lastID);
        }
        // 3️⃣ Jump directly → use cached total height (ONLY if NOT stale)
        else if (page > 1 && rootState.tokens.tokenHeight) {
          const totalTxs = Number(rootState.tokens.tokenHeight);
          const targetOffset = (page - 1) * Number(limit);
          const targetId = totalTxs - targetOffset;
          lastIdToUse = targetId > 0 ? String(targetId) : "0";
        }

        // API call
        const response = await graphqlClient.request(GET_TRANSFER_BY_NFT, {
          contract: address,
          tokenId: String(token_id),
          lastId: lastIdToUse,
          limit: String(limit),
        });
        const txData = response?.transfersByNft || {};
        const transfers = txData?.transfers || [];

        if (transfers.length > 0) {
          const totalTxs = Number(txData?.totalTransfers || 0);
          const totalPages = Math.ceil(totalTxs / limit);

          // Save updated meta info
          dispatch.tokens.setTokenHeight(totalTxs);
          dispatch.tokens.setAddressPages(totalPages);

          // Replace data
          dispatch.tokens.setTransferByNFT(transfers);

          // Return last ID
          return transfers[transfers.length - 1]?.number;
        } else {
          dispatch.tokens.setTransferByNFT([]);
        }
      } catch (err) {
        console.error("Error fetching NFT transfers:", err.message);
      } finally {
        dispatch.tokens.setLoading(false);
      }
    },
  }),
});
