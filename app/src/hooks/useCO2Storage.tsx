// @ts-ignore
import { FGStorage } from "@co2-storage/js-api";
import { useEffect, useState } from "react";

const authType = "metamask";
const ipfsNodeType = "browser";
const ipfsNodeAddr = "/dns4/web2.co2.storage/tcp/5002/https";
const fgApiUrl = "https://web2.co2.storage";

export const useCO2Storage = () => {
  const [co2Storage, setCO2Storage] = useState();
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
