import { gql } from "@apollo/client";

export const GET_BLOCKS = gql`
  query GetBlocks($limit: String!) {
    blocks(limit: $limit) {
      id
      block_number
      transactions
      block_reward
      block_hash
      timestamp
    }
  }
`;
export const GET_BLOCKS_WITH_PAGINATION = gql`
  query GetBlocks($lastId: String!, $limit: String!) {
    blocks(lastId: $lastId, limit: $limit) {
      id
      block_number
      transactions
      block_reward
      block_hash
      timestamp
      miner
    }
  }
`;
export const GET_DASHBOARD = gql`
  query {
    dashboard {
      total_transactions
      latest_block_height
      total_accounts
      current_tps
    }
  }
`;
export const GET_LATEST_BLOCK_ID = gql`
  query GetLatestBlockId {
    blocks(limit: "1") {
      id
    }
  }
`;
export const GET_BLOCK_DETAILS = gql`
  query GetBlockDetails($id: String!) {
    block(id: $id) {
      id
      block_number
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
      block_status
      miner
      size
    }
  }
`;

export const GET_TRANSACTIONS = gql`
  query GetTransactions($limit: String!) {
    transactions(limit: $limit) {
      id
      hash
      block
      from
      to
      value
      gas
      gas_price
      transaction_type
      transaction_status
      timestamp
      nonce
    }
  }
`;
export const GET_TRANSACTIONS_WITH_PAGINATION = gql`
  query GetTransactions($lastId: String!, $limit: String!) {
    transactions(lastId: $lastId, limit: $limit) {
      id
      transaction_status
      hash
      transaction_type
      block
      number
      timestamp
      from
      to
      value
      transactionstatus
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
export const GET_LATEST_TRANSACTION_ID = gql`
  query GetLatestTransactionId {
    transactions(limit: "1") {
      id
      number
    }
  }
`;
export const GET_TRANSACTION_DETAILS = gql`
  query GetTransactionDetails($id: String!) {
    transaction(id: $id) {
      id
      transaction_status
      hash
      transaction_type
      block
      number
      timestamp
      from
      to
      value
      transactionstatus
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
  query TransactionLogs($txHash: String!) {
    transactionLogs(txHash: $txHash) {
      id
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

export const GET_TRANSACTIONS_BY_ADDRESS = gql`
  query TransactionsByAddress(
    $address: String!
    $lastId: String!
    $limit: String!
  ) {
    transactionsByAddress(address: $address, lastId: $lastId, limit: $limit) {
      transactions {
        id
        transaction_status
        hash
        transaction_type
        block
        number
        timestamp
        from
        to
        value
        transactionstatus
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

export const SEARCH_QUERY = gql`
  query search($value: String!) {
    search(value: $value) {
      block {
        id
        block_number
        previous_hash
        state_root
        transaction_root
        reciept_root
        logs_bloom
        transactions
        block_reward
        value
        data
        to
        block_hash
      }
      transaction {
        id
        hash
        block
        from
        to
        value
        transaction_status
        transaction_type
        status
        nonce
        type
        node_id
        gas
        gas_price
        input
      }
      transactions {
        id
        order
        hash
        block
        from
        to
        value
        transaction_status
        transaction_type
        status
        nonce
        type
        node_id
        gas
        gas_price
        input
      }
    }
  }
`;

export const GET_UNCONFIRMED_AND_BALLOTED_BLOCKS = gql`
  query GetUnconfirmedAndBallotedBlocks {
    unconfirmedAndBallotedBlock {
      type
      block_number
      total_transactions
    }
  }
`;

export const GET_TRANSACTIONS_BY_STATUS = gql`
  query GetTransactionsByStatus($status: String!) {
    transactionsByStatus(status: $status) {
      id
      transactionStatus
      hash
      block
      from
      to
      value
      transactionStatus
      functionType
      Status
      State
      nonce
      type
      nodeId
      gas
      gasPrice
      input
    }
  }
`;
export const GET_ACCOUNT_BALANCE = gql`
  query GetUserBalance($address: String!) {
    addressBalance(address: $address) {
      balance
    }
  }
`;
export const GET_ADDRESS_INFO = gql`
  query GetAddressInfo($address: String!) {
    address(address: $address) {
      id
      number
      balance
      timestamp
      total_transactions
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

export const GET_BLOCK_TRANSACTIONS = gql`
  query GetBlockTransactions($id: String!) {
    blockTransactions(id: $id) {
      id
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

export const GET_FIRST_TRANSACTION_BY_ADDRESS = gql`
  query FirstTransactionByAddress($address: String!) {
    firstTransactionsByAddress(address: $address) {
      id
      transaction_status
      hash
      transaction_type
      block
      number
      timestamp
      from
      to
      value
      transactionstatus
      status
      nonce
      type
      node_id
      gas
      gas_price
      gas_used
      contract_address
      input
    }
  }
`;

export const GET_TRANSACTIONS_BY_ADDRESS_EVENTS = gql`
  query TransactionsByAddressEvents(
    $address: String!
    $lastId: String!
    $limit: String!
  ) {
    eventsByAddress(address: $address, lastId: $lastId, limit: $limit) {
      events {
        id
        number
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
      totalEvents
    }
  }
`;
export const GET_ERC_TOKEN = gql`
  query ERcTokens($address: String!, $lastId: String!, $limit: String!) {
    erc20TokenTxs(address: $address, lastId: $lastId, limit: $limit) {
      transfers {
        id
        transaction_hash
        log_index
        block_number
        timestamp
        token_address
        from
        to
        value
        token_type
        number
      }
      totalTransfers
    }
  }
`;
export const GET_NFT_TRANSFERS = gql`
  query NftTransfers($address: String!, $lastId: String!, $limit: String!) {
    nftTransfers(address: $address, lastId: $lastId, limit: $limit) {
      transfers {
        id
        transaction_hash
        log_index
        block_number
        timestamp
        token_address
        from
        to
        value
        token_type
        number
      }
      totalTransfers
    }
  }
`;
export const GET_NFT_MINTS = gql`
  query NftMint($lastId: String!, $limit: String!) {
    nftMints(lastId: $lastId, limit: $limit) {
      transfers {
        id
        transaction_hash
        log_index
        block_number
        timestamp
        token_address
        from
        to
        value
        token_type
        number
        token_id
        name
        logo
      }
      totalTransfers
    }
  }
`;
export const GET_VERFIED_SIGNATURES = gql`
  query verifiedContracts($lastId: String!, $limit: String!) {
    verifiedContracts(lastId: $lastId, limit: $limit) {
      verifiedContracts {
        id
        number
        balance
        timestamp
        total_transactions
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
      totalVerifiedContracts
    }
  }
`;
export const GET_VERIFIED_CONTRACTS = gql`
  query GetVerifiedContracts($lastId: String, $limit: String!) {
    verifiedContracts(lastId: $lastId, limit: $limit) {
      verifiedContracts {
        id
        number
        balance
        timestamp
        total_transactions
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
      totalVerifiedContracts
      totalVerifiedContractsLast24Hours
      totalDeployedContracts
      totalDeployedContractsLast24Hours
    }
  }
`;
export const GET_NFT_TRANSFERS_OVERALL = gql`
  query NftTransfers($lastId: String!, $limit: String!) {
    nftTransfers(lastId: $lastId, limit: $limit) {
      transfers {
        id
        transaction_hash
        log_index
        block_number
        timestamp
        token_address
        from
        to
        value
        token_type
        number
        token_id
        name
        logo
      }
      totalTransfers
    }
  }
`;
export const GET_ERC_TOKEN_OVERALL = gql`
  query ERcTokens($lastId: String!, $limit: String!) {
    erc20TokenTxs(lastId: $lastId, limit: $limit) {
      transfers {
        id
        transaction_hash
        log_index
        block_number
        timestamp
        token_address
        from
        to
        value
        token_type
        number
      }
      totalTransfers
    }
  }
`;

export const GET_TOP_ACCOUNTS = gql`
  query topAccounts($lastId: String!, $limit: String!) {
    topAccounts(lastId: $lastId, limit: $limit) {
      accounts {
        id
        number
        balance
        timestamp
        total_transactions
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
      totalAccounts
    }
  }
`;
export const GET_NFTS_BY_ADDRESS = gql`
  query nftsByAddress($address: String!) {
    nftsByAddress(address: $address) {
      nfts {
        id
        number
        type
        token_address
        owner
        token_id
        amount
        token_uri
      }
      totalNFTS
    }
  }
`;
export const GET_LAST_14_DAYS_TXS = gql`
  query last14DaysTxs {
    last14DaysTxs {
      dailyTxs {
        date
        txCount
      }
      totalTxs
    }
  }
`;

export const GET_NFT_DETAIL_DATA = gql`
  query GetNftDetailData($contract: String!, $tokenId: String!) {
    nft(contract: $contract, tokenId: $tokenId) {
      id
      number
      type
      token_address
      owner
      token_id
      amount
      token_uri
      token_uri_resolved
    }
  }
`;

export const GET_TRANSFER_BY_NFT = gql`
  query transfersByNft(
    $contract: String!
    $tokenId: String!
    $lastId: String!
    $limit: String!
  ) {
    transfersByNft(
      contract: $contract
      tokenId: $tokenId
      lastId: $lastId
      limit: $limit
    ) {
      transfers {
        id
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
export const GET_METRICS_HISTORY_CURRENT = gql`
  query GetMetricsHistory($metrics: [String!], $start: String!, $end: String!) {
    getMetricsHistory(metrics: $metrics, start: $start, end: $end) {
      metric
      timestamp
      value
    }
  }
`;
export const GET_BLOCK_TIME_HISTORY_CURRENT = gql`
  query GetMetricsHistory($metrics: [String!], $start: String!, $end: String!) {
    getMetricsHistory(metrics: $metrics, start: $start, end: $end) {
      metric
      timestamp
      value
    }
  }
`;
