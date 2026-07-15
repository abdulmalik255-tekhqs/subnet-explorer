import { gql } from "@apollo/client";

export const GET_ALL_CHAINS = gql`
  query GetAllChains {
    allChains {
      primary {
        name
        chain_id
      }
      orbits {
        name
        chain_id
      }
    }
  }
`;

export const GET_ORBITS = gql`
  query GetOrbits($lastId: String, $limit: String) {
    orbits(lastId: $lastId, limit: $limit) {
      orbits {
        name
        orbit_id
        tps
        transaction_count
        address_count
        total_deployed_contracts
        status
      }
      totalOrbits
    }
  }
`;

export const GET_LAST_14_DAYS_TXS = gql`
  query GetLast14DaysTxs($type: String!) {
    last14DaysTxs(type: $type) {
      dailyTxs {
        date
        txCount
      }
      totalTxs
    }
  }
`;

export const GET_NETWORK_OVERVIEW = gql`
  query GetNetworkOverview {
    networkOverview {
      total_orbits
      total_blockchains
      combined_tps
      total_transactions
    }
  }
`;

export const GET_ORBIT_DASHBOARD = gql`
  query GetOrbitDashboard($type: String!, $chainId: String!) {
    dashboard(type: $type, chainId: $chainId) {
      latest_block_height
      current_tps
      total_accounts
      total_transactions
      total_contracts
      chain_id
      total_nft_transfers
      total_erc20_transfers
    }
  }
`;
export const GET_METRICS_HISTORY = gql`
  query GetMetricsHistory(
    $metrics: [String!]!
    $start: String!
    $end: String!
    $type: String!
    $chainId: String
  ) {
    getMetricsHistory(
      metrics: $metrics
      start: $start
      end: $end
      type: $type
      chainId: $chainId
    ) {
      id
      metric
      timestamp
      value
    }
  }
`;

export const GET_LATEST_SEARCH_HISTORY = gql`
  query GetLatestSearchHistory {
    searchHistory {
      history {
        type
        chain_type
        chain_id
        chain_name
        title
        subtitle
        value
      }
    }
  }
`;
export const GET_SEARCH_HISTORY_BY_CHAIN = gql`
  query GetSearchHistoryByChain(
    $search: String!
    $chainType: String
    $chainId: String
  ) {
    search(search: $search, chainType: $chainType, chainId: $chainId) {
      type
      chain_type
      chain_id
      chain_name
      title
      subtitle
      value
    }
  }
`;
