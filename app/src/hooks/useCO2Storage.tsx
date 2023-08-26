// @ts-ignore
import { FGStorage } from "@co2-storage/js-api";
import { useEffect, useState } from "react";

const authType = "pk";
const ipfsNodeType = "client";
const ipfsNodeAddr = "/dns4/web1.co2.storage/tcp/5002/https";
const fgApiUrl = "https://web1.co2.storage";

export const useCO2Storage = () => {
  const [co2Storage, setCO2Storage] = useState<any>();
  useEffect(() => {
    const co2Storage = new FGStorage({
      authType: authType,
      ipfsNodeType: ipfsNodeType,
      ipfsNodeAddr: ipfsNodeAddr,
      fgApiHost: fgApiUrl,
    });
    setCO2Storage(co2Storage);
  }, []);
  return { co2Storage };
};
