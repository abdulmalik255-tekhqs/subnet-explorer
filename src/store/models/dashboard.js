import { createModel } from "@rematch/core";
import { graphqlClient } from "../../apolloClient";
import {
  GET_METRICS,
  GET_NODE_INFRASTRUCTURE,
  GET_NODE_MAP,
  GET_TRANSACTION_LIFE_CYCLE,
} from "../../dashboardQueries";
import {
  GET_BLOCK_TIME_HISTORY_CURRENT,
  GET_LAST_14_DAYS_TXS,
  GET_METRICS_HISTORY_CURRENT,
} from "../../queries";

export const dashboard = createModel()({
  name: "dashboard",
  state: {
    loading: false,
    nodeInfrastructureData: null,
    serviceStatus: null,
    transactionLifeCycleData: {},
    txnHistory: {},
    metricsHealth: [],
    metricsHistory: [],
    nodeMap: [],
    blockTime: [],
    avgLatency: [],
    blockTimeSeconds: null,
    finalityTimeSeconds: null,
    successRateTime: null,
    TPSvalue: null,
  },
  reducers: {
    setLoading(state, payload) {
      state.loading = payload;
    },
    setNodeInfrastructureData(state, payload) {
      state.nodeInfrastructureData = payload;
    },
    setServiceStatus(state, payload) {
      state.serviceStatus = payload;
    },
    setTransactionLifeCycle(state, payload) {
      state.transactionLifeCycleData = payload;
    },
    setTransactionHistory(state, payload) {
      state.txnHistory = payload;
    },
    setMetricsHealth(state, payload) {
      state.metricsHealth = payload;
    },
    setMetricsHistory(state, payload) {
      state.metricsHistory = payload;
    },
    setNodeMap(state, payload) {
      state.nodeMap = payload;
    },
    setBlockTimeHistory(state, payload) {
      state.blockTime = payload;
    },
    setAvgLatency(state, payload) {
      state.avgLatency = payload;
    },
    setBlockTimeSeconds(state, payload) {
      state.blockTimeSeconds = payload;
    },
    setFinalityTimeSeconds(state, payload) {
      state.finalityTimeSeconds = payload;
    },
    setSuccessRateTime(state, payload) {
      state.successRateTime = payload;
    },
    setTpsValue(state, payload) {
      state.TPSvalue = payload;
    },
  },
  effects: (dispatch) => ({
    async handleGetAllNodeInfrastructure() {
      try {
        dispatch.dashboard.setLoading(true);
        const response = await graphqlClient.request(GET_NODE_INFRASTRUCTURE);
        dispatch.dashboard.setNodeInfrastructureData(
          response?.nodeInfrastructure,
        );
        dispatch.dashboard.setServiceStatus(
          response?.nodeInfrastructure?.services,
        );
        dispatch.dashboard.setLoading(false);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.dashboard.setLoading(false);
      }
    },
    async handleGetTransactionLifeCycleFlow() {
      try {
        dispatch.dashboard.setLoading(true);
        const response = await graphqlClient.request(
          GET_TRANSACTION_LIFE_CYCLE,
        );
        dispatch.dashboard.setTransactionLifeCycle(
          response?.transactionLifeCycleFlow,
        );
        dispatch.dashboard.setLoading(false);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.dashboard.setLoading(false);
      }
    },
    async handleGetTxns() {
      try {
        dispatch.dashboard.setLoading(true);
        const response = await graphqlClient.request(GET_LAST_14_DAYS_TXS);
        dispatch.dashboard.setTransactionHistory(response?.last14DaysTxs);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.dashboard.setLoading(false);
      }
    },
    async handleGetMetricsHealth() {
      try {
        dispatch.dashboard.setLoading(true);
        const response = await graphqlClient.request(GET_METRICS);
        dispatch.dashboard.setMetricsHealth(response?.metrics);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.dashboard.setLoading(false);
      }
    },
    async handleGetNodeMap() {
      try {
        dispatch.dashboard.setLoading(true);
        const response = await graphqlClient.request(GET_NODE_MAP);
        dispatch.dashboard.setNodeMap(response?.mapData);
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.dashboard.setLoading(false);
      }
    },
    async handleGetMetricsHistory(payload) {
      try {
        dispatch.dashboard.setLoading(true);
        const { metric, startTime, endTime } = payload || {};
        const metrics = Array.isArray(metric) ? metric : metric ? [metric] : [];
        const response = await graphqlClient.request(
          GET_METRICS_HISTORY_CURRENT,
          {
            metrics,
            start: String(startTime || ""),
            end: String(endTime || ""),
          },
        );
        const history = response?.getMetricsHistory || [];
        dispatch.dashboard.setMetricsHistory(history);
        if (history.length > 0) {
          const lastIndex = history.length - 1;
          dispatch.dashboard.setTpsValue(history?.[lastIndex]?.value || null);
        } else {
          dispatch.dashboard.setTpsValue(null);
        }
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.dashboard.setLoading(false);
      }
    },
    async handleGetBlockTimeHistory(payload) {
      try {
        dispatch.dashboard.setLoading(true);
        const { metric, startTime, endTime } = payload || {};
        const metrics = Array.isArray(metric) ? metric : metric ? [metric] : [];

        const response = await graphqlClient.request(
          GET_BLOCK_TIME_HISTORY_CURRENT,
          {
            metrics,
            start: String(startTime || ""),
            end: String(endTime || ""),
          },
        );
        const history = response?.getMetricsHistory || [];
        dispatch.dashboard.setBlockTimeHistory(history);
        if (history.length > 0) {
          const lastIndex = history.length - 1;
          dispatch.dashboard.setFinalityTimeSeconds(
            history?.[lastIndex]?.value || null,
          );
        } else {
          dispatch.dashboard.setFinalityTimeSeconds(null);
        }
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.dashboard.setLoading(false);
      }
    },
    async handleGetAvgLatency(payload) {
      try {
        dispatch.dashboard.setLoading(true);
        const { metric, startTime, endTime } = payload || {};
        const metrics = Array.isArray(metric) ? metric : metric ? [metric] : [];

        const response = await graphqlClient.request(
          GET_METRICS_HISTORY_CURRENT,
          {
            metrics,
            start: String(startTime || ""),
            end: String(endTime || ""),
          },
        );
        const history = response?.getMetricsHistory || [];
        dispatch.dashboard.setAvgLatency(history);
        if (history.length > 0) {
          const lastIndex = history.length - 1;
          dispatch.dashboard.setSuccessRateTime(
            history?.[lastIndex]?.value || null,
          );
        } else {
          dispatch.dashboard.setSuccessRateTime(null);
        }
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.dashboard.setLoading(false);
      }
    },
    async handleGetBlockTimeSeconds(payload) {
      try {
        dispatch.dashboard.setLoading(true);
        const { metric, startTime, endTime } = payload || {};
        const metrics = Array.isArray(metric) ? metric : metric ? [metric] : [];

        const response = await graphqlClient.request(
          GET_BLOCK_TIME_HISTORY_CURRENT,
          {
            metrics,
            start: String(startTime || ""),
            end: String(endTime || ""),
          },
        );
        const lastIndex = response?.getMetricsHistory?.length - 1;
        dispatch.dashboard.setBlockTimeSeconds(
          response?.getMetricsHistory?.[lastIndex]?.value || null,
        );
      } catch (err) {
        console.log(err.message);
      } finally {
        dispatch.dashboard.setLoading(false);
      }
    },
  }),
});
