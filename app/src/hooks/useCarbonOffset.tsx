import { useEffect, useState } from "react";
import { useEthersSigner } from "@/hooks/useEthers";
import { CarbonOffset__factory, CarbonOffset } from "@/lib/typechain-types";
import { useNetwork } from "wagmi";

const CARBON_OFFSET_CONTRACT_ADDRESS = "0xdA4176a1668cfE99DD7336d909925F2f5037e924";

export const useCarbonOffset = () => {
  const { chain } = useNetwork();
  const ethersSigner = useEthersSigner();
  const [carbonOffset, setCarbonOffset] = useState<CarbonOffset>();
  useEffect(() => {
    if (!ethersSigner || !chain || chain.id !== 5) {
      return;
    }
    const carbonOffsetContract = CarbonOffset__factory.connect(CARBON_OFFSET_CONTRACT_ADDRESS, ethersSigner);
    setCarbonOffset(carbonOffsetContract);
  }, [chain, ethersSigner]);
  return {
    carbonOffset,
  };
};
