import type { NextApiRequest, NextApiResponse } from "next";
// @ts-ignore
import { FGStorage } from "@co2-storage/js-api";
const authType = "pk";
const ipfsNodeType = "client";
const ipfsNodeAddr = "/dns4/web1.co2.storage/tcp/5002/https";
const fgApiUrl = "https://web1.co2.storage";

const co2Storage = new FGStorage({
  authType: authType,
  ipfsNodeType: ipfsNodeType,
  ipfsNodeAddr: ipfsNodeAddr,
  fgApiHost: fgApiUrl,
});

type Data = {
  hash: string;
  grantId: string;
};

type ResponseData = {
  error?: string;
  result?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const data: Data = req.body;
  if (!data.hash || typeof data.hash !== "string") {
    return res.status(400).json({ error: "Invalid hash" });
  }
  if (!data.grantId || typeof data.grantId !== "string") {
    return res.status(400).json({ error: "Invalid grantId" });
  }
  const addElement = [
    {
      name: "Allo Pool ID",
      value: data.grantId,
    },
    {
      name: "Payment Tx",
      value: data.hash,
    },
    {
      name: "Expected CO2 reduction",
      // this is hardcoded, and out of scope of this demo
      // this should connect carbon credit to the actual CO2 reduction
      value: "300kg",
    },
  ];
  const addAssetResponse = await co2Storage.addAsset(
    addElement,
    {
      parent: null,
      name: "Carbon Credit for Allo Pool",
      description: "Carbon Credit for Allo Pool",
      template: "bafyreihakwxlw5hj4272bkwqmpwud3obb2yyqisrvni7h3ymvfvpc5mnau",
    },
    "sandbox",
  );
  if (addAssetResponse.error != null) {
    throw new Error(addAssetResponse.error);
  }
  const assetId = addAssetResponse.result.block;
  console.log(assetId);
  res.status(200).json({ result: { assetId } });
}
