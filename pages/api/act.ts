import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../lib/prisma";

type ResponseData = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method == "POST") {
    await prisma.act.create({
      data: {
        beatSheetId: req.body.beatsheetId,
        description: req.body.actDescription,
      },
    });
    res.status(200).json({ message: "Success" });
    return;
  }
  res.status(404);
}