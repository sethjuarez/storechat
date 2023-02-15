import type { NextApiRequest, NextApiResponse } from "next";
import { PromptState } from "@types";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { PromptDataService, PromptRecord } from "@services/cosmos";

const COSMOS_ENDPOINT = process.env.COSMOS_ENDPOINT || "";
const COSMOS_KEY = process.env.COSMOS_KEY || "";
const COSMOS_DATABASE = process.env.COSMOS_DATABASE || "";

const handler = async (req: NextApiRequest, res: NextApiResponse<string>) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json("Not Authorized");
  }
  if (session?.user?.email) {
    const user = session.user.email.split("@")[0];
    const promptService = new PromptDataService({
      endpoint: COSMOS_ENDPOINT,
      key: COSMOS_KEY,
      database: COSMOS_DATABASE,
    });
    await promptService.init();

    if (req.method === "POST") {
      const request = req.body as PromptState;
      const prompt: PromptRecord = {
        id: user,
        ...request,
      };
      const response = await promptService.upsert(prompt);
      res.status(200).json(response);
    } else if (req.method === "GET") {
      const response = await promptService.get(user);
      if (response) {
        res.status(200).json(
          JSON.stringify({
            selected: response.selected,
            prompts: response.prompts,
          })
        );
      } else {
        res.status(200).json(
          JSON.stringify({
            selected: 0,
            prompts: [],
          })
        );
      }
    }
  } else {
    res.status(401).json("Not Authorized");
  }
};

export default handler;
