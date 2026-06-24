import { createModel } from "@rematch/core";
import { graphqlClient } from "../../apolloClient";
import {
  GET_ACCOUNT_BALANCE,
  GET_ADDRESS_INFO,
  GET_ERC_TOKEN,
  GET_FIRST_TRANSACTION_BY_ADDRESS,
  GET_LATEST_TRANSACTION_ID,
  GET_NFT_TRANSFERS,
  GET_NFTS_BY_ADDRESS,
  GET_TRANSACTION_DETAILS,
  GET_TRANSACTION_LOGS,
  GET_TRANSACTIONS,
  GET_TRANSACTIONS_BY_ADDRESS,
  GET_TRANSACTIONS_BY_ADDRESS_EVENTS,
  GET_TRANSACTIONS_BY_STATUS,
  GET_TRANSACTIONS_WITH_PAGINATION,
} from "../../queries";
import { invalidTransaction } from "../../app.config";
import { parseAbi } from "../../utils";

export const transactions = createModel()({
  name: "transactions",
  state: {
    loading: false,
    transactions: [],
    AddressTransactions: [],
    transactionHeight: 0,
    transactionHeightAddress: 0,
    addressHeightAddress: 0,
    pages: 0,
    AddressPages: 0,
    transaction: invalidTransaction,
    transactionLogs: [],
    unconfirmedTransactions: [],
    ballotedTransactions: [],
    balance: "",
    addressInfo: {},
    firstTransaction: null,
    contractEvents: [],
    ercTokentransaction: [],
    nftTransferstransactions: [],
    // NEW
    readMethods: [],
    writeMethods: [],
    NFT: [],
  },
  reducers: {
    setLoading(state, payload) {
      state.loading = payload;
    },
    setTransactions(state, payload) {
      state.transactions = payload;
    },
    setTransactionHeight(state, payload) {
      state.transactionHeight = payload;
    },
    setAddressHeight(state, payload) {
      state.addressHeightAddress = payload;
    },
    setPages(state, payload) {
      state.pages = payload;
    },
    setTransaction(state, payload) {
      state.transaction = payload;
    },
    addUnconfirmedTransaction(state, payload) {
      const alreadyExists = state.unconfirmedTransactions.some(
        (tx) => tx.hash === payload.hash
      );

      if (!alreadyExists) {
        state.unconfirmedTransactions = [
          payload,
          ...state.unconfirmedTransactions,
        ];
      }
    },
    moveToBallotedTransactions(state, payload) {
      const index = state.unconfirmedTransactions.findIndex(
        (tx) => tx.hash === payload.hash
      );
      if (index !== -1) {
        const matchedTx = state.unconfirmedTransactions[index];
        state.ballotedTransactions = [matchedTx, ...state.ballotedTransactions];
        // state.unconfirmedTransactions = state.unconfirmedTransactions.splice(
        //   index,
        //   1
        // );
        state.unconfirmedTransactions = state.unconfirmedTransactions.filter(
          (tx) => tx.hash !== payload.hash
        );
      }
    },
    removeBallotedTransaction(state, payload) {
      // Remove from unconfirmedTransactions using filter (Immutable approach)
      state.unconfirmedTransactions = state.unconfirmedTransactions.filter(
        (tx) => tx.hash !== payload.hash
      );

      // Remove from ballotedTransactions using filter (Immutable approach)
      state.ballotedTransactions = state.ballotedTransactions.filter(
        (tx) => tx.hash !== payload.hash
      );
    },
    setUnconfirmedTransactions(state, payload) {
      state.unconfirmedTransactions = payload;
    },
    setBallotedTransactions(state, payload) {
      state.ballotedTransactions = payload;
    },
    setBalance(state, payload) {
      state.balance = payload;
    },
    handleAddressInfo(state, payload) {
      state.addressInfo = payload;
    },
    setAddressTransaction(state, payload) {
      state.AddressTransactions = payload;
    },
    setAddressTransactionHeight(state, payload) {
      state.transactionHeightAddress = payload;
    },
    setAddressPages(state, payload) {
      state.AddressPages = payload;
    },
    setTransactionLogs(state, payload) {
      state.transactionLogs = payload;
    },
    setFirstTransaction(state, payload) {
      state.firstTransaction = payload;
    },
    setContractEvents(state, payload) {
      state.contractEvents = payload;
    },
    setERCTokens(state, payload) {
      state.ercTokentransaction = payload;
    },
    setNftTransfers(state, payload) {
      state.nftTransferstransactions = payload;
    },
    setReadMethods(state, payload) {
      state.readMethods = payload;
    },
    setWriteMethods(state, payload) {
      state.writeMethods = payload;
    },
    setNFTS(state, payload) {
      state.NFT = payload;
    },
  },
  effects: (dispatch) => ({
    async handleGetAllTxs() {
      try {
        dispatch.transactions.setLoading(true);
        const response = await graphqlClient.request(GET_TRANSACTIONS, {
          limit: "6",
        });
        dispatch.transactions.setTransactions(response?.transactions);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.transactions.setLoading(false);
      }
    },
    async handleGetLatestTransactionId() {
      try {
        dispatch.transactions.setLoading(true);
        const response = await graphqlClient.request(GET_LATEST_TRANSACTION_ID);
        let count = response?.transactions[0]?.number;
        const height = Number(count);
        const pages = Math.ceil(height / 10);
        dispatch.transactions.setTransactionHeight(height);
        dispatch.transactions.setPages(pages);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.blocks.setLoading(false);
      }
    },
    async getTransactionWithPagination({ page, limit }, rootState) {
      try {
        dispatch.transactions.setLoading(true);

        const transactionHeight = rootState.transactions.transactionHeight;
        let lastId;

        if (page === 1) {
          lastId = "0";
        } else if (transactionHeight) {
          const targetTxnIndex = (page - 1) * limit;
          const targetTxnId = transactionHeight - targetTxnIndex;
          lastId = String(targetTxnId > 0 ? targetTxnId : 0);
        } else {
          lastId = "0";
        }

        const response = await graphqlClient.request(
          GET_TRANSACTIONS_WITH_PAGINATION,
          {
            lastId: String(lastId),
            limit: String(limit),
          }
        );
        const transactions = response?.transactions || [];

        if (transactions.length > 0) {
          // ✅ Always recalculate total pages if limit changes
          const lastID = transactions?.[transactions.length - 1]?.number;
          const height =
            Number(rootState.transactions.transactionHeight) || Number(lastID);

          const pages = Math.ceil(height / Number(limit));

          // dispatch.transactions.setTransactionHeight(height);
          dispatch.transactions.setPages(pages);

          // Replace transactions for current page
          dispatch.transactions.setTransactions(transactions);
        }
      } catch (err) {
        console.error("Error fetching paginated transactions:", err.message);
      } finally {
        dispatch.transactions.setLoading(false);
      }
    },
    async getSingleTransaction(transactionHash) {
      try {
        dispatch.transactions.setLoading(true);

        const response = await graphqlClient.request(GET_TRANSACTION_DETAILS, {
          id: transactionHash,
        });

        dispatch.transactions.setTransaction(
          response?.transaction || invalidTransaction
        );
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.transactions.setLoading(false);
      }
    },
    async getTransactionLogs(txHash) {
      try {
        dispatch.transactions.setLoading(true);
        const response = await graphqlClient.request(GET_TRANSACTION_LOGS, {
          txHash,
        });
        dispatch.transactions.setTransactionLogs(
          response?.transactionLogs || []
        );
      } catch (err) {
        console.error("Error fetching transaction logs:", err.message);
      } finally {
        dispatch.transactions.setLoading(false);
      }
    },
    async getTransactionByAddressWithPagination(
      { address, page, limit, lastID },
      rootState
    ) {
      try {
        dispatch.transactions.setLoading(true);

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
        else if (rootState.transactions.addressHeightAddress) {
          const totalTxs = Number(rootState.transactions.addressHeightAddress);
          const targetOffset = (page - 1) * Number(limit);
          const targetId = totalTxs - targetOffset;
          lastIdToUse = targetId > 0 ? String(targetId) : "0";
        }

        // 🧠 Make the API request
        const response = await graphqlClient.request(
          GET_TRANSACTIONS_BY_ADDRESS,
          {
            address,
            lastId: lastIdToUse,
            limit: String(limit),
          }
        );

        const txData = response?.transactionsByAddress || {};
        const transactions = txData?.transactions || [];

        if (transactions.length > 0) {
          const totalTxs = Number(txData?.totalTransactions || 0);
          const totalPages = Math.ceil(totalTxs / limit);

          // Save updated meta info
          dispatch.transactions.setAddressHeight(totalTxs);
          dispatch.transactions.setAddressPages(totalPages);

          // Replace transactions for the current page
          dispatch.transactions.setAddressTransaction(transactions);

          // ✅ Return last transaction ID (so caller can use it for next page)
          return transactions[transactions.length - 1]?.number;
        }
      } catch (err) {
        console.error(
          "Error fetching address transactions with pagination:",
          err.message
        );
      } finally {
        dispatch.transactions.setLoading(false);
      }
    },
    async getUnconfirmedTransactions() {
      try {
        dispatch.transactions.setLoading(true);
        const response = await graphqlClient.request(
          GET_TRANSACTIONS_BY_STATUS,
          {
            status: "Unconfirmed",
          }
        );

        dispatch.transactions.setUnconfirmedTransactions(
          response?.transactionsByStatus || []
        );
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.transactions.setLoading(false);
      }
    },
    async getBallotedTransactions() {
      try {
        dispatch.transactions.setLoading(true);
        const response = await graphqlClient.request(
          GET_TRANSACTIONS_BY_STATUS,
          {
            status: "Balloted",
          }
        );
        dispatch.transactions.setBallotedTransactions(
          response?.transactionsByStatus || []
        );
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.transactions.setLoading(false);
      }
    },
    async getAccountBalance({ address }) {
      try {
        dispatch.transactions.setLoading(true);
        const response = await graphqlClient.request(GET_ACCOUNT_BALANCE, {
          address,
        });
        dispatch.transactions.setBalance(response?.addressBalance?.balance);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.transactions.setLoading(false);
      }
    },
    async getAddressInfo({ address }) {
      try {
        dispatch.transactions.setLoading(true);

        const response = await graphqlClient.request(GET_ADDRESS_INFO, {
          address,
        });

        dispatch.transactions.handleAddressInfo(response?.address);

        // Convert backend ABI object → array of strings
        // const rawAbiArray = Object.values(response?.address?.abi || {});

        // const { readMethods, writeMethods } = parseAbi(rawAbiArray);
        const { readMethods, writeMethods } = parseAbi(response?.address?.abi);

        dispatch.transactions.setReadMethods(readMethods);
        dispatch.transactions.setWriteMethods(writeMethods);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.transactions.setLoading(false);
      }
    },
    async getFirstTransactionByAddress({ address }) {
      try {
        const response = await graphqlClient.request(
          GET_FIRST_TRANSACTION_BY_ADDRESS,
          {
            address,
          }
        );
        dispatch.transactions.setFirstTransaction(
          response?.firstTransactionsByAddress || null
        );
      } catch (err) {
        console.log(err.message);
        dispatch.transactions.setFirstTransaction(null);
      }
    },
    async getTransactionByAddressEventsWithPagination(
      { address, page, limit, lastID },
      rootState
    ) {
      try {
        dispatch.transactions.setLoading(true);

        let lastIdToUse = "0";

        // Page 1 → always start fresh
        if (page === 1) {
          lastIdToUse = "0";
        }
        // Next page → use lastID returned from previous call
        else if (lastID) {
          lastIdToUse = String(lastID);
        }
        // Jump to arbitrary page
        else if (page > 1 && rootState.transactions.transactionHeightAddress) {
          const totalTxs = Number(
            rootState.transactions.transactionHeightAddress
          );
          const targetOffset = (page - 1) * Number(limit);
          const targetId = totalTxs - targetOffset;

          lastIdToUse = targetId > 0 ? String(targetId) : "0";
        }

        // GraphQL call
        const response = await graphqlClient.request(
          GET_TRANSACTIONS_BY_ADDRESS_EVENTS,
          {
            address,
            lastId: lastIdToUse,
            limit: String(limit),
          }
        );
        const txData = response?.eventsByAddress || {};
        const events = txData?.events || [];

        if (events.length > 0) {
          const totalTxs = Number(txData?.totalEvents || 0);
          const totalPages = Math.ceil(totalTxs / limit);

          // Save meta once (not overwritten later)
          dispatch.transactions.setAddressTransactionHeight(totalTxs);
          dispatch.transactions.setAddressPages(totalPages);

          dispatch.transactions.setContractEvents(events);

          return events[events.length - 1]?.number;
        }
      } catch (err) {
        console.error(
          "Error fetching address transactions with pagination:",
          err.message
        );
      } finally {
        dispatch.transactions.setLoading(false);
      }
    },

    async getTransactionByAddressERCWithPagination(
      { address, page, limit, lastID },
      rootState
    ) {
      try {
        dispatch.transactions.setLoading(true);

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
        else if (page > 1 && rootState.transactions.transactionHeightAddress) {
          const totalTxs = Number(
            rootState.transactions.transactionHeightAddress
          );
          const targetOffset = (page - 1) * Number(limit);
          const targetId = totalTxs - targetOffset;
          lastIdToUse = targetId > 0 ? String(targetId) : "0";
        }

        // 🧠 Make the API request
        const response = await graphqlClient.request(GET_ERC_TOKEN, {
          address,
          lastId: lastIdToUse,
          limit: String(limit),
        });
        const txData = response?.erc20TokenTxs || {};
        const transfers = txData?.transfers || [];
        if (transfers.length > 0) {
          const totalTxs = Number(txData?.totalTransfers || 0);
          const totalPages = Math.ceil(totalTxs / limit);

          // Save updated meta info
          dispatch.transactions.setAddressTransactionHeight(totalTxs);
          dispatch.transactions.setAddressPages(totalPages);

          // Replace transactions for the current page
          dispatch.transactions.setERCTokens(transfers);

          // ✅ Return last transaction ID (so caller can use it for next page)
          return transfers[transfers.length - 1]?.number;
        }
      } catch (err) {
        console.error(
          "Error fetching address transactions with pagination:",
          err.message
        );
      } finally {
        dispatch.transactions.setLoading(false);
      }
    },
    async getNFTransfersTransactionWithPagination(
      { address, page, limit, lastID },
      rootState
    ) {
      try {
        dispatch.transactions.setLoading(true);

        // 💥 FIX: Reset stale cached value for Page 1
        if (page === 1) {
          dispatch.transactions.setAddressTransactionHeight(null);
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
        else if (page > 1 && rootState.transactions.transactionHeightAddress) {
          const totalTxs = Number(
            rootState.transactions.transactionHeightAddress
          );
          const targetOffset = (page - 1) * Number(limit);
          const targetId = totalTxs - targetOffset;
          lastIdToUse = targetId > 0 ? String(targetId) : "0";
        }

        // API call
        const response = await graphqlClient.request(GET_NFT_TRANSFERS, {
          address,
          lastId: lastIdToUse,
          limit: String(limit),
        });

        const txData = response?.nftTransfers || {};
        const transfers = txData?.transfers || [];

        if (transfers.length > 0) {
          const totalTxs = Number(txData?.totalTransfers || 0);
          const totalPages = Math.ceil(totalTxs / limit);

          // Save updated meta info
          dispatch.transactions.setAddressTransactionHeight(totalTxs);
          dispatch.transactions.setAddressPages(totalPages);

          // Replace data
          dispatch.transactions.setNftTransfers(transfers);

          // Return last ID
          return transfers[transfers.length - 1]?.number;
        }
      } catch (err) {
        console.error("Error fetching NFT transfers:", err.message);
      } finally {
        dispatch.transactions.setLoading(false);
      }
    },
    async getNFTAddress({ address }) {
      try {
        dispatch.transactions.setLoading(true);
        // API call
        const response = await graphqlClient.request(GET_NFTS_BY_ADDRESS, {
          address,
        });

        const txData = response?.nftsByAddress || {};
        const transfers = txData?.nfts || [];
        if (transfers.length > 0) {
          // Replace data
          dispatch.transactions.setNFTS(transfers);

          // Return last ID
          return transfers[transfers.length - 1]?.number;
        } else {
          dispatch.transactions.setNFTS([]);
        }
      } catch (err) {
        console.error("Error fetching NFT transfers:", err.message);
      } finally {
        dispatch.transactions.setLoading(false);
      }
    },
  }),
});
