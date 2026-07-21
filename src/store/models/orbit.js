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
  GET_ORBIT_TRANSACTIONS,
  GET_LATEST_SEARCH_HISTORY,
  GET_SEARCH_HISTORY_BY_CHAIN,
  GET_METRICS_HISTORY,
  GET_GLOBAL_TRANSACTIONS,
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
        console.log("response?.blocks", response?.blocks);
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
        dispatch.orbit.setBlockTransactions(
          response?.blockTransactions ?? [],
        );
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
  }),
});
