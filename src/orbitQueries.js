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
        chain_id
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

export const GET_GLOBAL_TRANSACTIONS = gql`
  query GetGlobalTransactions($limit: String) {
    globalTransactions(limit: $limit) {
      id
      chain_type
      chain_id
      chain_name
      transaction_status
      hash
      block
      number
      timestamp
      from
      to
      value
      transactionstatus
      transaction_type
      status
      nonce
      type
      node_id
      gas
      gas_price
      gas_used
      contract_address
      input
      function_name
      function_args
    }
  }
`;

export const GET_ORBIT_DETAIL = gql`
  query GetOrbitDetail($chainId: String!) {
    orbitDetail(chainId: $chainId) {
      name
      orbit_id
      chain_id
      vm_type
      description
      created_at
    }
  }
`;

export const GET_ADDRESS_BALANCE = gql`
  query GetAddressBalance($chainId: String!, $address: String!) {
    addressBalance(chainId: $chainId, address: $address) {
      balance
    }
  }
`;

export const GET_ORBIT_BLOCKS = gql`
  query GetOrbitBlocks($chainId: String!, $lastId: String, $limit: String) {
    blocks(chainId: $chainId, lastId: $lastId, limit: $limit) {
      id
      type
      chain_id
      chain_name
      block_number
      block_status
      previous_hash
      state_root
      transaction_root
      reciept_root
      timestamp
      logs_bloom
      transactions
      block_reward
      value
      data
      to
      block_hash
    }
  }
`;

export const GET_ORBIT_BLOCK = gql`
  query GetOrbitBlock($chainId: String!, $id: String!) {
    block(chainId: $chainId, id: $id) {
      id
      type
      chain_id
      chain_name
      block_number
      block_status
      previous_hash
      state_root
      transaction_root
      reciept_root
      timestamp
      logs_bloom
      transactions
      block_reward
      value
      data
      to
      block_hash
    }
  }
`;

export const GET_BLOCK_TRANSACTIONS = gql`
  query GetBlockTransactions($chainId: String!, $id: String!) {
    blockTransactions(chainId: $chainId, id: $id) {
      id
      chain_type
      chain_id
      chain_name
      transaction_status
      hash
      block
      number
      timestamp
      from
      to
      value
      transactionstatus
      transaction_type
      status
      nonce
      type
      node_id
      gas
      gas_price
      gas_used
      contract_address
      input
      function_name
      function_args
    }
  }
`;

export const GET_TRANSACTION = gql`
  query GetTransaction($chainId: String!, $id: String!) {
    transaction(chainId: $chainId, id: $id) {
      id
      chain_type
      chain_id
      chain_name
      transaction_status
      hash
      block
      number
      timestamp
      from
      to
      value
      transactionstatus
      transaction_type
      status
      nonce
      type
      node_id
      gas
      gas_price
      gas_used
      contract_address
      input
      function_name
      function_args
    }
  }
`;

export const GET_TRANSACTION_LOGS = gql`
  query GetTransactionLogs($chainId: String!, $txHash: String!) {
    transactionLogs(chainId: $chainId, txHash: $txHash) {
      id
      chain_id
      log_index
      transaction_index
      block_number
      transaction_hash
      address
      data
      topics
      timestamp
      event_name
      event_args
    }
  }
`;

export const GET_ORBIT_TRANSACTIONS = gql`
  query GetOrbitTransactions(
    $chainId: String!
    $lastId: String
    $limit: String
  ) {
    transactions(chainId: $chainId, lastId: $lastId, limit: $limit) {
      id
      chain_type
      chain_id
      chain_name
      transaction_status
      hash
      block
      number
      timestamp
      from
      to
      value
      transactionstatus
      transaction_type
      status
      nonce
      type
      node_id
      gas
      gas_price
      gas_used
      contract_address
      input
      function_name
      function_args
    }
  }
`;

export const GET_ORBIT_ADDRESS = gql`
  query GetOrbitAddress($chainId: String!, $address: String!) {
    address(chainId: $chainId, address: $address) {
      id
      chain_id
      chain_name
      number
      balance
      timestamp
      deployed_timestamp
      total_transactions
      total_events
      total_erc20_transfers
      total_nft_transfers
      is_contract
      creator
      creation_tx_hash
      is_verified
      contract_name
      abi
      compiler_version
      license
      source_code
      optimizer
      on_chain_bytecode
      evm_version
      via_ir
      is_proxy
      proxy_type
      implementation
      admin
      beacon
      constructor_args
      code_structure
    }
  }
`;

export const GET_FIRST_TRANSACTIONS_BY_ADDRESS = gql`
  query GetFirstTransactionsByAddress($chainId: String!, $address: String!) {
    firstTransactionsByAddress(chainId: $chainId, address: $address) {
      id
      chain_type
      chain_id
      chain_name
      transaction_status
      hash
      block
      number
      timestamp
      from
      to
      value
      transactionstatus
      transaction_type
      status
      nonce
      type
      node_id
      gas
      gas_price
      gas_used
      contract_address
      input
      function_name
      function_args
    }
  }
`;

export const GET_TRANSACTIONS_BY_ADDRESS = gql`
  query GetTransactionsByAddress(
    $chainId: String!
    $address: String!
    $lastId: String
    $limit: String
  ) {
    transactionsByAddress(
      chainId: $chainId
      address: $address
      lastId: $lastId
      limit: $limit
    ) {
      transactions {
        id
        chain_type
        chain_id
        chain_name
        transaction_status
        hash
        block
        number
        timestamp
        from
        to
        value
        transactionstatus
        transaction_type
        status
        nonce
        type
        node_id
        gas
        gas_price
        gas_used
        contract_address
        input
        function_name
        function_args
      }
      totalTransactions
    }
  }
`;

export const GET_ERC20_TOKEN_TXS = gql`
  query GetErc20TokenTxs(
    $chainId: String!
    $address: String!
    $lastId: String
    $limit: String
  ) {
    erc20TokenTxs(
      chainId: $chainId
      address: $address
      lastId: $lastId
      limit: $limit
    ) {
      transfers {
        id
        chain_id
        number
        transaction_hash
        log_index
        block_number
        timestamp
        token_address
        from
        to
        value
        token_type
        token_id
        name
        logo
      }
      totalTransfers
    }
  }
`;

export const GET_NFT_TRANSFERS = gql`
  query GetNftTransfers(
    $chainId: String!
    $address: String!
    $lastId: String
    $limit: String
  ) {
    nftTransfers(
      chainId: $chainId
      address: $address
      lastId: $lastId
      limit: $limit
    ) {
      transfers {
        id
        chain_id
        number
        transaction_hash
        log_index
        block_number
        timestamp
        token_address
        from
        to
        value
        token_type
        token_id
        name
        logo
      }
      totalTransfers
    }
  }
`;

export const GET_NFTS_BY_ADDRESS = gql`
  query GetNftsByAddress(
    $chainId: String!
    $address: String!
    $lastId: String
    $limit: String
  ) {
    nftsByAddress(
      chainId: $chainId
      address: $address
      lastId: $lastId
      limit: $limit
    ) {
      nfts {
        id
        chain_id
        number
        type
        token_address
        owner
        token_id
        amount
        token_uri
        token_uri_resolved
      }
      totalNFTS
    }
  }
`;

export const GET_LATEST_SEARCH_HISTORY = gql`
  query GetLatestSearchHistory {
    searchHistory {
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
