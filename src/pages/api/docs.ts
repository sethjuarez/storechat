import type { NextApiRequest, NextApiResponse } from "next";
import { TurnResponse, TurnRequest } from "@types";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse<string>) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json("Not Authorized");
  }
  if(session?.user?.email) { 
    const user = session.user.email.split("@")[0];
    res.status(200).json("thanks!");
    

  } else {
    res.status(401).json("Not Authorized");
  }
};

export default handler;
