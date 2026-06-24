export const privateKey = process.env.REACT_APP_WALLET_PRIVATE_KEY;
export const rpcUrl = process.env.REACT_APP_RPC_URL;
export const baseUrl = process.env.REACT_APP_BASE_URL;
export const socketUrl = process.env.REACT_APP_SOCKET_URL;
export const commonURL = process.env.REACT_BASE_URL;
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

export const defaultUnconfirmedTransactions = [
  {
    id: "13",
    hash: "0xa4e399a5dedf5abe3c5b77a41156c72c86b8f42213a384fc3477701b5354271b",
    block: "288",
    from: "0x5D421D63551427A073b4d940d96B13018ca107A4",
    to: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
    value: "100",
    functionType: "Transfer",
    gas: "0",
    gas_price: "0",
  },
  {
    id: "12",
    hash: "0xbdcaded01ad1709e02e3056d6efdc885ede9f9cfecc36dde0bcc1fcb224819a2",
    block: "257",
    from: "0x5D421D63551427A073b4d940d96B13018ca107A4",
    to: "0x1a9C456dc225E69c8c23146B3EC1760dDE54ca1a",
    value: "0",
    functionType: "Contract",
    gas: "0",
    gas_price: "0",
  },
  {
    id: "11",
    hash: "0xa4e399a5dedf5abe3c5b77a41156c72c86b8f42213a384fc3477701b5354271c",
    block: "289",
    from: "0x5D421D63551427A073b4d940d96B13018ca107A4",
    to: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
    value: "100",
    functionType: "Transfer",
    gas: "0",
    gas_price: "0",
  },
  {
    id: "10",
    hash: "0xbdcaded01ad1709e02e3056d6efdc885ede9f9cfecc36dde0bcc1fcb224819a3",
    block: "260",
    from: "0x5D421D63551427A073b4d940d96B13018ca107A4",
    to: "0x1a9C456dc225E69c8c23146B3EC1760dDE54ca1a",
    value: "0",
    functionType: "Contract",
    gas: "0",
    gas_price: "0",
  },
  {
    id: "9",
    hash: "0xbdcaded01ad1709e02e3056d6efdc885ede9f9cfecc36dde0bcc1fcb224819a1",
    block: "259",
    from: "0x5D421D63551427A073b4d940d96B13018ca107A4",
    to: "0x1a9C456dc225E69c8c23146B3EC1760dDE54ca1a",
    value: "0",
    functionType: "Contract",
    gas: "0",
    gas_price: "0",
  },
  {
    id: "7",
    hash: "0xa4e399a5dedf5abe3c5b77a41156c72c86b8f42213a384fc3477701b5354271a",
    block: "287",
    from: "0x5D421D63551427A073b4d940d96B13018ca107A4",
    to: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
    value: "100",
    functionType: "Transfer",
    gas: "0",
    gas_price: "0",
  },
  {
    id: "6",
    hash: "0xbdcaded01ad1709e02e3056d6efdc885ede9f9cfecc36dde0bcc1fcb224819ae",
    block: "258",
    from: "0x5D421D63551427A073b4d940d96B13018ca107A4",
    to: "0x1a9C456dc225E69c8c23146B3EC1760dDE54ca1a",
    value: "0",
    functionType: "Contract",
    gas: "0",
    gas_price: "0",
  },
  {
    id: "5",
    hash: "0x40f78b35c4f9c28baa81eabcbcd51a364849d3458ea42c26ab540645abadb3e4",
    block: "253",
    from: "0x5D421D63551427A073b4d940d96B13018ca107A4",
    to: "0x1a9C456dc225E69c8c23146B3EC1760dDE54ca1a",
    value: "0",
    functionType: "Contract",
    gas: "0",
    gas_price: "0",
  },
  {
    id: "4",
    hash: "0x758086d82d27a18dd138b26216a8ef1fe50bac7e2dcb976d1ff325d18212bba5",
    block: "244",
    from: "0x5D421D63551427A073b4d940d96B13018ca107A4",
    to: "0x1a9C456dc225E69c8c23146B3EC1760dDE54ca1a",
    value: "0",
    functionType: "Contract",
    gas: "0",
    gas_price: "0",
  },
  {
    id: "3",
    hash: "0x0233091c82ee950afb01c98e7f6ee925f9e9d73edc3d5a06c7683e40abfd71b1",
    block: "242",
    from: "0x5D421D63551427A073b4d940d96B13018ca107A4",
    to: "0x1a9C456dc225E69c8c23146B3EC1760dDE54ca1",
    value: "0",
    functionType: "Contract",
    gas: "0",
    gas_price: "0",
  },
];
