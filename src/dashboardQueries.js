import { gql } from "@apollo/client";

export const GET_NODE_INFRASTRUCTURE = gql`
  query GetNodeInfrastructure {
    nodeInfrastructure {
      id
      cpu_usage
      total_ram
      ram_used
      cpu_cores
      disk_total
      disk_usage_percentage
      disk_usage
      services
    }
  }
`;
export const GET_TRANSACTION_LIFE_CYCLE = gql`
  query GetTransactionLifeCycle {
    transactionLifeCycleFlow {
      submitted
      validated
      included_in_block
      finalized
    }
  }
`;
export const GET_METRICS = gql`
  query GetMetrics {
    metrics {
      metric
      timestamp
      value
    }
  }
`;
export const GET_METRICS_HISTORY = gql`
  query GetMetricsHistory($metrics: [String!], $start: String!, $end: String!) {
    getMetricsHistory(metrics: $metrics, start: $start, end: $end) {
      metric
      timestamp
      value
    }
  }
`;
export const GET_NODE_MAP = gql`
  query GetNodeMap {
    mapData {
      id
      nodes_location
    }
  }
`;
