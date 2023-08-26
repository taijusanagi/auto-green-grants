import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  hash: string;
};

type ResponseData = {
  message: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const data: Data = req.body;
  if (!data.hash || typeof data.hash !== "string") {
    return res.status(400).json({ message: "Invalid data provided" });
  }

  // TODO: integrate co2.storage
  console.log("Verifying carbon offset transaction with hash", data.hash);

  const signature = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
  res.status(200).json({ message: signature });
}
