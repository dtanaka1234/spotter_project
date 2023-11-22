import Head from 'next/head'
import { GetStaticProps } from "next";
import Link from "next/link";
import prisma from "../../lib/prisma";
import { Beatsheet } from "../../types/beatsheets";
import Grid from '@mui/material/Grid';

import { StyledCard, StyledCardImg, StyledCardTitle } from '../../components/beatsheets/beatsheets.styled';
import { Button, CardActions, CardContent } from "@mui/material";

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
    });
  }

  return {
    props: { beatsheets: convertedBeetsheets },
    revalidate: 10,
  };
};

export default function Beatsheets({beatsheets}: StaticProps) {
  return (
    <div>
      <Head>
        <title>My Beatsheets</title>
        <meta property="og:title" content="My Beatsheets" key="title"/>
      </Head>
      <h1>My Beetsheets</h1>
      <Grid container spacing={2} style={{ padding: 16 }}>
        {
          beatsheets.map((beatsheet) =>
            <StyledCard key={beatsheet.id} sx={{ minWidth: 250 }}>
              <StyledCardImg src="/sample_beatsheet_thumbnail.jpg"/>
              <CardContent>
                <StyledCardTitle>
                  { beatsheet.title }
                </StyledCardTitle>
              </CardContent>
              <CardActions>
                <Link href={`/beatsheets/${beatsheet.id}`}>
                  <Button size="small" color="primary">Open Beatsheet</Button>
                </Link>
              </CardActions>
            </StyledCard>)
        }
      </Grid>
    </div>
  )
}