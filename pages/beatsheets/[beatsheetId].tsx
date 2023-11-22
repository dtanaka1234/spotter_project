import Head from 'next/head'
import { GetStaticPaths, GetStaticProps } from "next";
import prisma from "../../lib/prisma";
import ActView from "../../components/acts/act_view";
import { Act } from "../../types/acts";

interface StaticProps {
  beatsheetTitle: string;
  acts: any[];
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;
  const beatsheetId = params.beatsheetId;

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
        beats: [
          {
            id: element.beatid,
            description: element.beatdescription,
            duration: element.duration,
            cameraAngle: element.cameraAngle,
          }
        ],
      }
    }
  }

  const convertedActs: Act[] = Object.keys(actIdMap).reduce((acc, key) => {
    const actObj = actIdMap[key];
    acc.push(actObj);
    return acc;
  }, []);

  return {
    props: { beatsheetTitle, acts: convertedActs },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths<{ beatsheetId: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking' //indicates the type of fallback
  }
}

export default function BeatsheetEditor({ beatsheetTitle, acts }: StaticProps) {
  return (
    <div>
      <Head>
        <title>{`Editing ${beatsheetTitle}`}</title>
        <meta property="og:title" content={beatsheetTitle} key="title"/>
      </Head>
      <h1>Acts for Beatsheet</h1>
      <div>
        {
          acts.map((act) => <ActView key={act.id} act={act}/>)
        }
      </div>
    </div>
  );
}