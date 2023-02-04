
import type { NextApiRequest, NextApiResponse } from 'next'
import { TurnResponse, TurnRequest } from '@types'
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const CHATGPT_URI = process.env.CHATGPT_URI || "";
const CHATGPT_KEY = process.env.CHATGPT_KEY || "";

const handler = async (req: NextApiRequest, res: NextApiResponse<TurnResponse | string>) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json("Not Authorized");
  }

  const request = req.body as TurnRequest;

  const options = {
    method: "POST",
    body: JSON.stringify(request),
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + CHATGPT_KEY,
      "ocp-apim-subscription-key": CHATGPT_KEY,
      "api-key": CHATGPT_KEY,
    },
  };

  const response = await fetch(CHATGPT_URI, options);
  const data: TurnResponse = await response.json();
  res.status(200).json(data);
}

export default handler;
