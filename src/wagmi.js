import { createConfig, http } from "wagmi";
import { mainnet, baseSepolia } from "wagmi/chains";
import { explorerUri, rpcUri } from "./app.config";

export const brytNetwork = {
  id: 257,
  name: "Bryt Network",
  network: "bryt",
  nativeCurrency: {
    decimals: 18,
    name: "BRYT",
    symbol: "RYT",
  },
  rpcUrls: {
    default: {
      http: [rpcUri],
    },
  },
  blockExplorers: {
    default: {
      name: "Bryt Explorer",
      url: explorerUri,
    },
  },
};

export const config = createConfig({
  chains: [mainnet, baseSepolia],
  transports: {
    // [mainnet.id]: http(),
    // [baseSepolia.id]: http(),
    [brytNetwork.id]: http(),
  },
});
