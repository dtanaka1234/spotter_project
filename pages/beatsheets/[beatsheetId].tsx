import Head from 'next/head'
import { GetStaticPaths, GetStaticProps } from "next";
import prisma from "../../lib/prisma";
import ActView from "../../components/acts/act_view";
import { Act } from "../../types/acts";

interface StaticProps {
  beatsheetTitle: string;
  acts: any[];
}

export const getStaticProps: GetStaticProps = async () => {
  const actsForBeatsheet = await prisma.$queryRaw`
      SELECT
          *
      FROM "BeatSheet"
               LEFT OUTER JOIN "Act" as act ON act."beatSheetId" = "BeatSheet".id
    `;

  let beatsheetTitle = '';
  const convertedActs: Act[] = [];
  for (const element of actsForBeatsheet) {
    beatsheetTitle = element.title;
    convertedActs.push({
      id: element.id,
      description: element.description,
    });
  }

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