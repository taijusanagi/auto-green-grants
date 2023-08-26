import { useEffect, useState } from "react";
import { useEthersProvider, useEthersSigner } from "@/hooks/useEthers";
import { ALLO_CORE_ADDRESS, ALLO_REGISTRY_ADDRESS } from "@/lib/allo";
import {
  Allo__factory,
  Allo,
  Registry,
  Registry__factory,
  DirectGrantsSimpleStrategy,
  DirectGrantsSimpleStrategy__factory,
} from "@/lib/typechain-types";

import { useNetwork } from "wagmi";
import { ContractFactory, ethers } from "ethers";

export const useAllo = () => {
  const { chain } = useNetwork();
  const ethersSigner = useEthersSigner();
  const ethersProvider = useEthersProvider();
  const [alloCoreContract, setAlloCoreContract] = useState<Allo>();
  const [alloRegistryContract, setAlloRegistryContract] = useState<Registry>();
  const [directGrantsSimpleStrategy, setDirectGrantsSimpleStrategy] = useState<DirectGrantsSimpleStrategy>();

  useEffect(() => {
    if (!ethersSigner || !chain || chain.id !== 5) {
      return;
    }
    const alloCoreContract = Allo__factory.connect(ALLO_CORE_ADDRESS, ethersSigner);
    const alloRegistryContract = Registry__factory.connect(ALLO_REGISTRY_ADDRESS, ethersSigner);
    setAlloCoreContract(alloCoreContract);
    setAlloRegistryContract(alloRegistryContract);
  }, [chain, ethersSigner]);

  const deployDirectGrantsSimpleStrategy = async () => {
    const directGrantsSimpleStrategyFactory = new ethers.ContractFactory(
      DirectGrantsSimpleStrategy__factory.abi,
      DirectGrantsSimpleStrategy__factory.bytecode,
      ethersSigner,
    );
    const directGrantsSimpleStrategy = await directGrantsSimpleStrategyFactory.deploy(
      ALLO_CORE_ADDRESS,
      "DirectGrantsSimpleStrategy",
    );
    await directGrantsSimpleStrategy.deployed();
    const result = directGrantsSimpleStrategy as DirectGrantsSimpleStrategy;
    setDirectGrantsSimpleStrategy(result);
    return result;
  };

  const attachDirectGrantsSimpleStrategy = (address: string) => {
    const result = DirectGrantsSimpleStrategy__factory.connect(address, ethersSigner || ethersProvider);
    setDirectGrantsSimpleStrategy(result);
    return result;
  };

  return {
    alloCoreContract,
    alloRegistryContract,
    directGrantsSimpleStrategy,
    deployDirectGrantsSimpleStrategy,
    attachDirectGrantsSimpleStrategy,
  };
};
