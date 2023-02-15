import type { NextApiRequest, NextApiResponse } from "next";
import { TurnResponse, TurnRequest } from "@types";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const CHATGPT_URI = process.env.CHATGPT_URI || "";
const CHATGPT_KEY = process.env.CHATGPT_KEY || "";
const IS_DEV = process.env.NODE_ENV === "development";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<TurnResponse | string>
) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json("Not Authorized");
  }

  /*
  if (IS_DEV) {
    const r: TurnResponse = {
      choices: [{
        text: "[DEV]",
        index: 0,
        finish_reason: "stop",
        logprobs: .9,
      }],
      created: new Date().getTimezoneOffset(),
      id: "ID",
      model: "fake-text-model",
      object: "text",
      usage: {
        completion_tokens: 0,
        prompt_tokens: 0,
        total_tokens: 0,
      }
    };
    res.status(200).json(r);
    return;
  }
  */

  const request = req.body as TurnRequest;
  const options = {
    method: "POST",
    body: JSON.stringify(request),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + CHATGPT_KEY,
      "ocp-apim-subscription-key": CHATGPT_KEY,
      "api-key": CHATGPT_KEY,
    },
  };
  const response = await fetch(CHATGPT_URI, options);
  
  const data: TurnResponse = await response.json();
  //console.log("data", data);
  res.status(200).json(data);
};

export default handler;
