import Head from 'next/head'
import * as React from 'react';
import { GetStaticPaths, GetStaticProps } from "next";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import prisma from "../../lib/prisma";
import ActView from "../../components/acts/act_view";
import { Act } from "../../types/acts";
import { AddActButton, HeaderContainer } from "../../components/beatsheets/beatsheets.styled";
import { Button, TextField } from "@mui/material";

interface StaticProps {
  beatsheetId: number;
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
  }

  const convertedActs: Act[] = Object.keys(actIdMap).reduce((acc, key) => {
    const actObj = actIdMap[key];
    acc.push(actObj);
    return acc;
  }, []);

  return {
    props: { beatsheetId: parseInt(beatsheetId as string), beatsheetTitle, acts: convertedActs },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths<{ beatsheetId: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking' //indicates the type of fallback
  }
}

export default function BeatsheetEditor({ beatsheetId, beatsheetTitle, acts }: StaticProps) {
  const [addActDialogOpen, setAddActDialogOpen] = React.useState<boolean>(false);
  const [newActNameText, setNewActNameText] = React.useState<string>("");

  const handleAddActDialogClose = () => {
    setAddActDialogOpen(false);
    setNewActNameText("");
  };

  const createNewAct = async () => {
    await fetch('/api/act', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ beatsheetId, actDescription: newActNameText }),
    })
    setAddActDialogOpen(false);
  };

  return (
    <div>
      <Head>
        <title>{`Editing ${beatsheetTitle}`}</title>
        <meta property="og:title" content={beatsheetTitle} key="title"/>
      </Head>
      <Dialog open={addActDialogOpen} onClose={handleAddActDialogClose}>
        <DialogTitle>Add New Act</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your new act description.
          </DialogContentText>
          <TextField
            value={newActNameText}
            onChange={(e) => { setNewActNameText(e.target.value); }}
            autoFocus
            margin="dense"
            id="name"
            label="Act Description"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleAddActDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={createNewAct}>Create</Button>
        </DialogActions>
      </Dialog>
      <HeaderContainer>
        <h1>Acts for Beatsheet</h1>
        <AddActButton variant="contained" onClick={() => { setAddActDialogOpen(true); }}>Add Act</AddActButton>
      </HeaderContainer>
      <div>
        {
          acts.map((act) => <ActView key={act.id} act={act}/>)
        }
      </div>
    </div>
  );
}