import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useEthersProvider, useEthersSigner } from "@/hooks/useEthers";
import { Allo, Registry, DirectGrantsSimpleStrategy } from "@/lib/typechain-types";

import { useNetwork } from "wagmi";
import { HypercertClient } from "@hypercerts-org/sdk";

export const useHyperCert = () => {
  const { chain } = useNetwork();
  const ethersSigner = useEthersSigner();
  const [hyperCert, setHyperCert] = useState<HypercertClient>();

  useEffect(() => {
    if (!ethersSigner || !chain || chain.id !== 5) {
      return;
    }
    import("@hypercerts-org/sdk").then(({ HypercertClient }) => {
      const client = new HypercertClient({
        chainId: 5, // goerli testnet
        operator: ethersSigner,
        nftStorageToken: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY,
        web3StorageToken: process.env.NEXT_PUBLIC_WEB3_STORAGE_API_KEY,
      });
      setHyperCert(client);
    });
  }, [ethersSigner, chain]);

  return { hyperCert };
};
