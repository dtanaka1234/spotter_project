import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../lib/prisma";
import { Act } from "../../types/acts";

type ResponseData = {
  beatsheetTitle,
  acts: Act[],
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method == "GET") {
    const query = req.query;
    const { beatsheetId } = query;

    const beatsForActs: any[] = await prisma.$queryRaw`
      SELECT
          beatsheet.title,
          act.id as actid,
          act.description as actdescription,
          beat.id as beatid,
          beat.description as beatdescription,
          beat."cameraAngle",
          beat.duration
      FROM "BeatSheet" as beatsheet
               LEFT OUTER JOIN "Act" as act ON act."beatSheetId" = beatsheet.id
               LEFT OUTER JOIN "Beat" as beat ON beat."actId" = act.id
      WHERE beatsheet.id = ${beatsheetId}::INT
    `;

    let beatsheetTitle = '';
    const actIdMap = {};
    for (const element of beatsForActs) {
      if (actIdMap[element.actid]) {
        actIdMap[element.actid].beats.push({
          id: element.beatid,
          description: element.beatdescription,
          duration: element.duration,
          cameraAngle: element.cameraAngle,
        });
      } else {
        actIdMap[element.actid] = {
          id: element.actid,
          description: element.actdescription,
          beats: element.beatid ? [
            {
              id: element.beatid,
              description: element.beatdescription,
              duration: element.duration,
              cameraAngle: element.cameraAngle,
            }
          ] : [],
        }
      }

      if (element.title) {
        beatsheetTitle = element.title;
      }
    }

    const convertedActs: Act[] = Object.keys(actIdMap).reduce((acc, key) => {
      const actObj = actIdMap[key];
      acc.push(actObj);
      return acc;
    }, []);

    res.status(200).json({ beatsheetTitle, acts: convertedActs });
    return;
  }
  res.status(405);
}