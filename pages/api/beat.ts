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
  } else if (req.method == "PUT") {
    const query = req.query;
    const { beatId } = query;
    await prisma.beat.update({
      data: {
        actId: req.body.actId,
        description: req.body.description,
        duration: req.body.duration,
        cameraAngle: req.body.cameraAngle,
      },
      where: {
        id: parseInt(beatId as string),
      }
    });
    res.status(200).json({ message: "Success" });
    return;
  }
  res.status(404);
}