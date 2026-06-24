import { createPublicClient, http } from "viem";
import { brytNetwork } from "./wagmi";

export const publicClient = createPublicClient({
  chain: brytNetwork,
  transport: http(),
});
