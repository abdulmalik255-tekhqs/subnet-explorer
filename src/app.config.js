export const privateKey = process.env.REACT_APP_WALLET_PRIVATE_KEY;
export const rpcUrl = process.env.REACT_APP_RPC_URL;
export const baseUrl = process.env.REACT_APP_BASE_URL;
export const socketUrl = process.env.REACT_APP_SOCKET_URL;
export const commonURL = process.env.REACT_BASE_URL;
export const baseSearchUrl = process.env.REACT_APP_BASE_SEARCH_URL;
export const baseApiKey = process.env.REACT_APP_BASE_API;
export const nftMetadataUrl = process.env.REACT_APP_NFT_METADATA_URL;
// Base Sepolia
export const explorerUri = "https://sepolia.basescan.org";
export const rpcUri = "https://new-bootnode-private.ryt.io/ext/bc/C/rpc";
export const invalidBlock = {
  block_hash: "0x0000000000000000000000000000000000000000",
  block_number: 87,
  block_reward: "0x0000000000000000000000000000000000000000",
  data: "0x0000000000000000000000000000000000000000",
  logs_bloom: "0x0000000000000000000000000000000000000000",
  merkle_root: "0x0000000000000000000000000000000000000000",
  previous_hash: "0x0000000000000000000000000000000000000000",
  reciept_root: "0x0000000000000000000000000000000000000000",
  state_root: "0x0000000000000000000000000000000000000000",
  timestamp: 1720633163,
  to: "0x0000000000000000000000000000000000000000",
  transaction_root: "0x0000000000000000000000000000000000000000",
  transactions: null,
  value: "0x0000000000000000000000000000000000000000",
  version: 1,
};

export const invalidTransaction = {
  order: "1",
  hash: "0x0000000000000000000000000000000000000000",
  block: "87",
  from: "0x0000000000000000000000000000000000000000",
  to: "0x0000000000000000000000000000000000000000",
  value: "0x00",
  transaction_status: true,
  functionType: "Transfer",
  Status: false,
  State: false,
  nonce: "0",
  type: "2",
  node_id: "",
  gas: "0",
  gas_price: "0",
  input: "",
};

export const ITEMS_PER_PAGE = 10;

export function sleep(ms = 2000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
