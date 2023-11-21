import Head from 'next/head'
import { GetStaticProps } from "next";
import prisma from "../../lib/prisma";
import { Beatsheet } from "../../types/beatsheets";

interface StaticProps {
  beatsheets: Beatsheet[];
}

export const getStaticProps: GetStaticProps = async () => {
  const beatsheets = await prisma.beatSheet.findMany();

  const convertedBeetsheets: Beatsheet[] = [];
  for (const element of beatsheets) {
    convertedBeetsheets.push({
      id: element.id,
      title: element.title,
      createdAt: element.createdAt.getTime(),
      updatedAt: element.updatedAt.getTime(),
    });
  }

  return {
    props: { beatsheets: convertedBeetsheets },
    revalidate: 10,
  };
};

export default ({ beatsheets }: StaticProps) => {
  return (
    <div>
      <Head>
        <title>My Beatsheets</title>
        <meta property="og:title" content="My Beatsheets" key="title" />
      </Head>
      <h1>My Beetsheets</h1>
      <ul>{ beatsheets.map((beatsheet) => <li>{ beatsheet.title }</li>) }</ul>
    </div>
  )
}