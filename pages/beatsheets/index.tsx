import Head from 'next/head'
import { InferGetStaticPropsType, GetStaticProps } from "next";
import prisma from "../../lib/prisma";
import {Beatsheet} from "../../types/beatsheets";

interface StaticProps {
  beatsheets: Beatsheet[];
}

export const getStaticProps: GetStaticProps = async () => {
  const beetsheets = await prisma.BeatSheet.findMany();

  for (const element of beetsheets) {
    element.createdAt = element.createdAt.getTime();
    element.updatedAt = element.updatedAt.getTime();
  }

  return {
    props: { beetsheets },
    revalidate: 10,
  };
};

export default ({ beetsheets }: StaticProps) => {
  return (
    <div>
      <Head>
        <title>My Beatsheets</title>
        <meta property="og:title" content="My Beatsheets" key="title" />
      </Head>
      <p>Hello world!</p>
      <ul>{ beetsheets.map((beatsheet) => <li>{ beatsheet.title }</li>) }</ul>
    </div>
  )
}