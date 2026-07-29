import { createModel } from "@rematch/core";
import { graphqlClient } from "../../apolloClient";
import {
  GET_ALL_CHAINS,
  GET_ORBIT_DASHBOARD,
  GET_NETWORK_OVERVIEW,
  GET_LAST_14_DAYS_TXS,
  GET_ORBITS,
  GET_ORBIT_DETAIL,
  GET_ORBIT_BLOCKS,
  GET_ORBIT_BLOCK,
  GET_BLOCK_TRANSACTIONS,
  GET_TRANSACTION,
  GET_TRANSACTION_LOGS,
  GET_ORBIT_ADDRESS,
  GET_ADDRESS_BALANCE,
  GET_FIRST_TRANSACTIONS_BY_ADDRESS,
  GET_TRANSACTIONS_BY_ADDRESS,
  GET_ERC20_TOKEN_TXS,
  GET_NFT_TRANSFERS,
  GET_NFTS_BY_ADDRESS,
  GET_ORBIT_NFT_DETAIL,
  GET_ORBIT_NFT_TOKEN_TRANSFERS,
  GET_ORBIT_TRANSACTIONS,
  GET_LATEST_SEARCH_HISTORY,
  GET_SEARCH_HISTORY_BY_CHAIN,
  GET_METRICS_HISTORY,
  GET_GLOBAL_TRANSACTIONS,
  GET_SEARCH_ORBIT,
} from "../../orbitQueries";

export const orbit = createModel()({
  name: "orbit",
  state: {
    loading: false,
    primary: [],
    orbits: [],
    dashboard: null,
    dashboardLoading: false,
    orbitDetail: null,
    orbitDetailLoading: false,
    networkOverview: null,
    networkOverviewLoading: false,
    txHistory: null,
    txHistoryLoading: false,
    registeredOrbits: [],
    registeredOrbitsLoading: false,
    totalOrbits: "0",
    searchHistory: [],
    metricsHistory: [],
    metricsHistoryLoading: false,
    globalTransactions: [],
    orbitBlocks: [],
    orbitBlocksLoading: false,
    orbitBlockDetail: null,
    orbitBlockDetailLoading: false,
    orbitTransactions: [],
    orbitTransactionsLoading: false,
    orbitBlocksTotal: null,
    orbitTransactionsTotal: null,
    blockTransactions: [],
    blockTransactionsLoading: false,
    orbitTransactionDetail: null,
    orbitTransactionDetailLoading: false,
    transactionLogs: [],
    transactionLogsLoading: false,
    orbitAddress: null,
    orbitAddressLoading: false,
    addressBalance: null,
    addressBalanceLoading: false,
    firstTransactionsByAddress: [],
    firstTransactionsByAddressLoading: false,
    transactionsByAddress: [],
    transactionsByAddressTotal: "0",
    transactionsByAddressLoading: false,
    erc20TokenTxs: [],
    erc20TokenTxsTotal: "0",
    erc20TokenTxsLoading: false,
    nftTransfers: [],
    nftTransfersTotal: "0",
    nftTransfersLoading: false,
    nftsByAddress: [],
    nftsByAddressTotal: "0",
    nftsByAddressLoading: false,
    orbitNftDetail: null,
    orbitNftDetailLoading: false,
    nftTokenTransfers: [],
    nftTokenTransfersTotal: "0",
    nftTokenTransfersLoading: false,
  },
  reducers: {
    setLoading(state, payload) {
      state.loading = payload;
    },
    setPrimary(state, payload) {
      state.primary = payload;
    },
    setOrbits(state, payload) {
      state.orbits = payload;
    },
    setDashboard(state, payload) {
      state.dashboard = payload;
    },
    setDashboardLoading(state, payload) {
      state.dashboardLoading = payload;
    },
    setOrbitDetail(state, payload) {
      state.orbitDetail = payload;
    },
    setOrbitDetailLoading(state, payload) {
      state.orbitDetailLoading = payload;
    },
    setNetworkOverview(state, payload) {
      state.networkOverview = payload;
    },
    setNetworkOverviewLoading(state, payload) {
      state.networkOverviewLoading = payload;
    },
    setTxHistory(state, payload) {
      state.txHistory = payload;
    },
    setTxHistoryLoading(state, payload) {
      state.txHistoryLoading = payload;
    },
    setRegisteredOrbits(state, payload) {
      state.registeredOrbits = payload;
    },
    setRegisteredOrbitsLoading(state, payload) {
      state.registeredOrbitsLoading = payload;
    },
    setTotalOrbits(state, payload) {
      state.totalOrbits = payload;
    },
    setSearchHistory(state, payload) {
      state.searchHistory = payload;
    },
    setMetricsHistory(state, payload) {
      state.metricsHistory = payload;
    },
    setMetricsHistoryLoading(state, payload) {
      state.metricsHistoryLoading = payload;
    },
    setGlobalTransactions(state, payload) {
      state.globalTransactions = payload;
    },
    setOrbitBlocks(state, payload) {
      state.orbitBlocks = payload;
    },
    setOrbitBlocksLoading(state, payload) {
      state.orbitBlocksLoading = payload;
    },
    setOrbitBlockDetail(state, payload) {
      state.orbitBlockDetail = payload;
    },
    setOrbitBlockDetailLoading(state, payload) {
      state.orbitBlockDetailLoading = payload;
    },
    setOrbitTransactions(state, payload) {
      state.orbitTransactions = payload;
    },
    setOrbitTransactionsLoading(state, payload) {
      state.orbitTransactionsLoading = payload;
    },
    setOrbitBlocksTotal(state, payload) {
      state.orbitBlocksTotal = payload;
    },
    setOrbitTransactionsTotal(state, payload) {
      state.orbitTransactionsTotal = payload;
    },
    setBlockTransactions(state, payload) {
      state.blockTransactions = payload;
    },
    setBlockTransactionsLoading(state, payload) {
      state.blockTransactionsLoading = payload;
    },
    setOrbitTransactionDetail(state, payload) {
      state.orbitTransactionDetail = payload;
    },
    setOrbitTransactionDetailLoading(state, payload) {
      state.orbitTransactionDetailLoading = payload;
    },
    setTransactionLogs(state, payload) {
      state.transactionLogs = payload;
    },
    setTransactionLogsLoading(state, payload) {
      state.transactionLogsLoading = payload;
    },
    setOrbitAddress(state, payload) {
      state.orbitAddress = payload;
    },
    setOrbitAddressLoading(state, payload) {
      state.orbitAddressLoading = payload;
    },
    setAddressBalance(state, payload) {
      state.addressBalance = payload;
    },
    setAddressBalanceLoading(state, payload) {
      state.addressBalanceLoading = payload;
    },
    setFirstTransactionsByAddress(state, payload) {
      state.firstTransactionsByAddress = payload;
    },
    setFirstTransactionsByAddressLoading(state, payload) {
      state.firstTransactionsByAddressLoading = payload;
    },
    setTransactionsByAddress(state, payload) {
      state.transactionsByAddress = payload;
    },
    setTransactionsByAddressTotal(state, payload) {
      state.transactionsByAddressTotal = payload;
    },
    setTransactionsByAddressLoading(state, payload) {
      state.transactionsByAddressLoading = payload;
    },
    setErc20TokenTxs(state, payload) {
      state.erc20TokenTxs = payload;
    },
    setErc20TokenTxsTotal(state, payload) {
      state.erc20TokenTxsTotal = payload;
    },
    setErc20TokenTxsLoading(state, payload) {
      state.erc20TokenTxsLoading = payload;
    },
    setNftTransfers(state, payload) {
      state.nftTransfers = payload;
    },
    setNftTransfersTotal(state, payload) {
      state.nftTransfersTotal = payload;
    },
    setNftTransfersLoading(state, payload) {
      state.nftTransfersLoading = payload;
    },
    setNftsByAddress(state, payload) {
      state.nftsByAddress = payload;
    },
    setNftsByAddressTotal(state, payload) {
      state.nftsByAddressTotal = payload;
    },
    setNftsByAddressLoading(state, payload) {
      state.nftsByAddressLoading = payload;
    },
    setOrbitNftDetail(state, payload) {
      state.orbitNftDetail = payload;
    },
    setOrbitNftDetailLoading(state, payload) {
      state.orbitNftDetailLoading = payload;
    },
    setNftTokenTransfers(state, payload) {
      state.nftTokenTransfers = payload;
    },
    setNftTokenTransfersTotal(state, payload) {
      state.nftTokenTransfersTotal = payload;
    },
    setNftTokenTransfersLoading(state, payload) {
      state.nftTokenTransfersLoading = payload;
    },
  },
  effects: (dispatch) => ({
    async handleGetAllChains() {
      try {
        dispatch.orbit.setLoading(true);
        const response = await graphqlClient.request(GET_ALL_CHAINS);
        dispatch.orbit.setPrimary(response?.allChains?.primary ?? []);
        dispatch.orbit.setOrbits(response?.allChains?.orbits ?? []);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.orbit.setLoading(false);
      }
    },
    async handleGetNetworkOverview() {
      try {
        dispatch.orbit.setNetworkOverviewLoading(true);
        const response = await graphqlClient.request(GET_NETWORK_OVERVIEW);
        dispatch.orbit.setNetworkOverview(response?.networkOverview ?? null);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.orbit.setNetworkOverviewLoading(false);
      }
    },
    async handleGetLast14DaysTxs(payload) {
      try {
        dispatch.orbit.setTxHistoryLoading(true);
        const { type = "primary" } = payload || {};
        const response = await graphqlClient.request(GET_LAST_14_DAYS_TXS, {
          type,
        });
        dispatch.orbit.setTxHistory(response?.last14DaysTxs ?? null);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.orbit.setTxHistoryLoading(false);
      }
    },
    async handleGetOrbits(payload) {
      try {
        dispatch.orbit.setRegisteredOrbitsLoading(true);
        const { lastId, limit = "100" } = payload || {};
        const response = await graphqlClient.request(GET_ORBITS, {
          lastId,
          limit,
        });
        dispatch.orbit.setRegisteredOrbits(response?.orbits?.orbits ?? []);
        dispatch.orbit.setTotalOrbits(response?.orbits?.totalOrbits ?? "0");
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.orbit.setRegisteredOrbitsLoading(false);
      }
    },
    async handleGetOrbitDashboard(payload) {
      try {
        dispatch.orbit.setDashboardLoading(true);
        const { type = "orbit", chainId = "1001" } = payload || {};
        const response = await graphqlClient.request(GET_ORBIT_DASHBOARD, {
          type,
          chainId,
        });
        dispatch.orbit.setDashboard(response?.dashboard ?? null);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.orbit.setDashboardLoading(false);
      }
    },
    async handleGetOrbitDetail(payload) {
      try {
        dispatch.orbit.setOrbitDetailLoading(true);
        const { chainId } = payload || {};
        const response = await graphqlClient.request(GET_ORBIT_DETAIL, {
          chainId,
        });
        dispatch.orbit.setOrbitDetail(response?.orbitDetail ?? null);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.orbit.setOrbitDetailLoading(false);
      }
    },
    async getLatestSearchHistory() {
      try {
        const response = await graphqlClient.request(GET_LATEST_SEARCH_HISTORY);
        dispatch.orbit.setSearchHistory(response?.searchHistory ?? []);
      } catch (err) {
        console.log(err.message);
        return [];
      }
    },
    async getSearchData(payload) {
      try {
        const { query, chainType, chainId } = payload || {};
        const response = await graphqlClient.request(
          GET_SEARCH_HISTORY_BY_CHAIN,
          {
            search: query,
            chainType,
            chainId,
          },
        );
        return response?.search ?? [];
      } catch (err) {
        console.log(err.message);
        return [];
      }
    },
    async handleGetMetricsHistory(payload) {
      try {
        dispatch.orbit.setMetricsHistoryLoading(true);
        const {
          metrics = ["tps"],
          start,
          end,
          type = "primary",
          chainId,
        } = payload || {};
        const response = await graphqlClient.request(GET_METRICS_HISTORY, {
          metrics,
          start,
          end,
          type,
          chainId,
        });
        dispatch.orbit.setMetricsHistory(response?.getMetricsHistory ?? []);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.orbit.setMetricsHistoryLoading(false);
      }
    },
    async handleGetGlobalTransactions(payload) {
      try {
        const { limit = "10" } = payload || {};
        const response = await graphqlClient.request(GET_GLOBAL_TRANSACTIONS, {
          limit,
        });
        dispatch.orbit.setGlobalTransactions(
          response?.globalTransactions ?? [],
        );
      } catch (err) {
        console.log(err.message);
      }
    },
    async handleGetOrbitBlocks(payload) {
      try {
        dispatch.orbit.setOrbitBlocksLoading(true);
        const { chainId, lastId = "0", limit = "10" } = payload || {};
        const response = await graphqlClient.request(GET_ORBIT_BLOCKS, {
          chainId,
          lastId,
          limit,
        });
        dispatch.orbit.setOrbitBlocks(response?.blocks ?? []);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.orbit.setOrbitBlocksLoading(false);
      }
    },
    async handleGetOrbitBlock(payload) {
      try {
        dispatch.orbit.setOrbitBlockDetailLoading(true);
        const { chainId, id } = payload || {};
        const response = await graphqlClient.request(GET_ORBIT_BLOCK, {
          chainId,
          id,
        });
        dispatch.orbit.setOrbitBlockDetail(response?.block ?? null);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.orbit.setOrbitBlockDetailLoading(false);
      }
    },
    async handleGetOrbitTransactions(payload) {
      try {
        dispatch.orbit.setOrbitTransactionsLoading(true);
        const { chainId, lastId = "0", limit = "10" } = payload || {};
        const response = await graphqlClient.request(GET_ORBIT_TRANSACTIONS, {
          chainId,
          lastId,
          limit,
        });
        dispatch.orbit.setOrbitTransactions(response?.transactions ?? []);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.orbit.setOrbitTransactionsLoading(false);
      }
    },

    async handleGetOrbitBlocksTotal(payload) {
      try {
        dispatch.orbit.setOrbitBlocksLoading(true);
        const { chainId, limit = "1" } = payload || {};
        const response = await graphqlClient.request(GET_ORBIT_BLOCKS, {
          chainId,
          limit,
        });
        dispatch.orbit.setOrbitBlocksTotal(
          response?.blocks?.[0]?.block_number ?? 0,
        );
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.orbit.setOrbitBlocksLoading(false);
      }
    },

    async handleGetOrbitTransactionsTotal(payload) {
      try {
        const { chainId, limit = "1" } = payload || {};
        const response = await graphqlClient.request(GET_ORBIT_TRANSACTIONS, {
          chainId,
          limit,
        });
        dispatch.orbit.setOrbitTransactionsTotal(
          response?.transactions?.[0]?.number ?? 0,
        );
      } catch (err) {
        console.log(err.message);
      }
    },

    async handleGetBlockTransactions(payload) {
      try {
        dispatch.orbit.setBlockTransactionsLoading(true);
        const { chainId, id } = payload || {};
        const response = await graphqlClient.request(GET_BLOCK_TRANSACTIONS, {
          chainId,
          id,
        });
        dispatch.orbit.setBlockTransactions(response?.blockTransactions ?? []);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.orbit.setBlockTransactionsLoading(false);
      }
    },

    async handleGetOrbitTransaction(payload) {
      try {
        dispatch.orbit.setOrbitTransactionDetailLoading(true);
        const { chainId, id } = payload || {};
        const response = await graphqlClient.request(GET_TRANSACTION, {
          chainId,
          id,
        });
        dispatch.orbit.setOrbitTransactionDetail(response?.transaction ?? null);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.orbit.setOrbitTransactionDetailLoading(false);
      }
    },

    async handleGetTransactionLogs(payload) {
      try {
        dispatch.orbit.setTransactionLogsLoading(true);
        const { chainId, txHash } = payload || {};
        const response = await graphqlClient.request(GET_TRANSACTION_LOGS, {
          chainId,
          txHash,
        });
        dispatch.orbit.setTransactionLogs(response?.transactionLogs ?? []);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.orbit.setTransactionLogsLoading(false);
      }
    },

    async handleGetOrbitAddress(payload) {
      try {
        dispatch.orbit.setOrbitAddressLoading(true);
        const { chainId, address } = payload || {};
        const response = await graphqlClient.request(GET_ORBIT_ADDRESS, {
          chainId,
          address,
        });
        dispatch.orbit.setOrbitAddress(response?.address ?? null);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.orbit.setOrbitAddressLoading(false);
      }
    },

    async handleGetAddressBalance(payload) {
      try {
        dispatch.orbit.setAddressBalanceLoading(true);
        const { chainId, address } = payload || {};
        const response = await graphqlClient.request(GET_ADDRESS_BALANCE, {
          chainId,
          address,
        });
        dispatch.orbit.setAddressBalance(
          response?.addressBalance?.balance ?? null,
        );
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.orbit.setAddressBalanceLoading(false);
      }
    },

    async handleGetFirstTransactionsByAddress(payload) {
      try {
        dispatch.orbit.setFirstTransactionsByAddressLoading(true);
        const { chainId, address } = payload || {};
        const response = await graphqlClient.request(
          GET_FIRST_TRANSACTIONS_BY_ADDRESS,
          { chainId, address },
        );
        const result = response?.firstTransactionsByAddress;
        const list = Array.isArray(result) ? result : result ? [result] : [];
        dispatch.orbit.setFirstTransactionsByAddress(list);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.orbit.setFirstTransactionsByAddressLoading(false);
      }
    },

    async handleGetTransactionsByAddress(payload) {
      try {
        dispatch.orbit.setTransactionsByAddressLoading(true);
        const { chainId, address, lastId = "0", limit = "10" } = payload || {};
        const response = await graphqlClient.request(
          GET_TRANSACTIONS_BY_ADDRESS,
          { chainId, address, lastId, limit },
        );
        const data = response?.transactionsByAddress;
        dispatch.orbit.setTransactionsByAddress(data?.transactions ?? []);
        dispatch.orbit.setTransactionsByAddressTotal(
          data?.totalTransactions ?? "0",
        );
        return data;
      } catch (err) {
        console.log(err.message);
        return null;
      } finally {
        dispatch.orbit.setTransactionsByAddressLoading(false);
      }
    },

    async handleGetErc20TokenTxs(payload) {
      try {
        dispatch.orbit.setErc20TokenTxsLoading(true);
        const { chainId, address, lastId = "0", limit = "10" } = payload || {};
        const response = await graphqlClient.request(GET_ERC20_TOKEN_TXS, {
          chainId,
          address,
          lastId,
          limit,
        });
        const data = response?.erc20TokenTxs;
        dispatch.orbit.setErc20TokenTxs(data?.transfers ?? []);
        dispatch.orbit.setErc20TokenTxsTotal(data?.totalTransfers ?? "0");
        return data;
      } catch (err) {
        console.log(err.message);
        return null;
      } finally {
        dispatch.orbit.setErc20TokenTxsLoading(false);
      }
    },

    async handleGetNftTransfers(payload) {
      try {
        dispatch.orbit.setNftTransfersLoading(true);
        const { chainId, address, lastId = "0", limit = "10" } = payload || {};
        const response = await graphqlClient.request(GET_NFT_TRANSFERS, {
          chainId,
          address,
          lastId,
          limit,
        });
        const data = response?.nftTransfers;
        dispatch.orbit.setNftTransfers(data?.transfers ?? []);
        dispatch.orbit.setNftTransfersTotal(data?.totalTransfers ?? "0");
        return data;
      } catch (err) {
        console.log(err.message);
        return null;
      } finally {
        dispatch.orbit.setNftTransfersLoading(false);
      }
    },

    async handleGetNftsByAddress(payload) {
      try {
        dispatch.orbit.setNftsByAddressLoading(true);
        const { chainId, address, lastId = "0", limit = "10" } = payload || {};
        const response = await graphqlClient.request(GET_NFTS_BY_ADDRESS, {
          chainId,
          address,
          lastId,
          limit,
        });
        const data = response?.nftsByAddress;
        dispatch.orbit.setNftsByAddress(data?.nfts ?? []);
        dispatch.orbit.setNftsByAddressTotal(data?.totalNFTS ?? "0");
        return data;
      } catch (err) {
        console.log(err.message);
        return null;
      } finally {
        dispatch.orbit.setNftsByAddressLoading(false);
      }
    },

    async handleGetOrbitNftDetail(payload) {
      try {
        dispatch.orbit.setOrbitNftDetailLoading(true);
        const { chainId, contract, tokenId } = payload || {};
        const response = await graphqlClient.request(GET_ORBIT_NFT_DETAIL, {
          chainId,
          contract,
          tokenId,
        });
        dispatch.orbit.setOrbitNftDetail(response?.nft ?? null);
        return response?.nft ?? null;
      } catch (err) {
        console.log(err.message);
        return null;
      } finally {
        dispatch.orbit.setOrbitNftDetailLoading(false);
      }
    },

    async handleGetNftTokenTransfers(payload) {
      try {
        dispatch.orbit.setNftTokenTransfersLoading(true);
        const {
          chainId,
          contract,
          tokenId,
          lastId = "0",
          limit = "10",
        } = payload || {};
        const response = await graphqlClient.request(
          GET_ORBIT_NFT_TOKEN_TRANSFERS,
          { chainId, contract, tokenId, lastId, limit },
        );
        const data = response?.transfersByNft;
        dispatch.orbit.setNftTokenTransfers(data?.transfers ?? []);
        dispatch.orbit.setNftTokenTransfersTotal(data?.totalTransfers ?? "0");
        return data;
      } catch (err) {
        console.log(err.message);
        return null;
      } finally {
        dispatch.orbit.setNftTokenTransfersLoading(false);
      }
    },

    async handleSearchOrbits(payload) {
      try {
        dispatch.orbit.setRegisteredOrbitsLoading(true);

        const { input } = payload || {};
        const response = await graphqlClient.request(GET_SEARCH_ORBIT, {
          input,
        });
        const data = response?.searchOrbits;
        dispatch.orbit.setRegisteredOrbits(data ?? []);
        return data;
      } catch (err) {
        console.log(err.message);
        return null;
      } finally {
        dispatch.orbit.setRegisteredOrbitsLoading(false);
      }
    },
  }),
});
