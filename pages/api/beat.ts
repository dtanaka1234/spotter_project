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
    await prisma.beat.create({
      data: {
        actId: req.body.actId,
        description: req.body.description,
        duration: req.body.duration,
        cameraAngle: req.body.cameraAngle,
      },
    });
    res.status(200).json({ message: "Success" });
    return;
  } else if (req.method == "DELETE") {
    /*const query = req.query;
    const { actId } = query;
    await prisma.act.delete({
      where: {
        id: parseInt(actId as string),
      },
    });
    res.status(200).json({ message: "Success" });*/
  }
  res.status(404);
}