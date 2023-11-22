import Head from 'next/head'
import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetStaticPaths, GetStaticProps } from "next";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import ActView from "../../components/acts/act_view";
import { Act } from "../../types/acts";
import { AddActButton, HeaderContainer } from "../../components/beatsheets/beatsheets.styled";
import { Button, TextField } from "@mui/material";
import {ActsResponse, getActs} from "../../api_clients/acts";

interface StaticProps {
  beatsheetId: number;
  beatsheetTitle: string;
  acts: Act[];
}

type ErrorResponse = {
  response: {
    data: {
      message: string
    }
  }
}

type SuccessResponse = {
  message: string
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;
  const beatsheetId = parseInt(params.beatsheetId as string);

  const actsListResponse = await getActs(beatsheetId);

  return {
    props: { beatsheetId, ...actsListResponse },
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

  const queryClient = useQueryClient()

  const { data } = useQuery<ActsResponse>({
    queryKey: ['actsList', beatsheetId],
    queryFn: async () => {
      return await getActs(beatsheetId);
    },
    initialData: { beatsheetTitle, acts },
  } as any);

  const createNewActMutation = useMutation<any, any, any, any>({
    mutationFn: (newActName) => {
      return fetch('/api/act', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ beatsheetId, actDescription: newActName }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actsList', beatsheetId] })
    },
  } as any);

  const handleAddActDialogClose = () => {
    setAddActDialogOpen(false);
    setNewActNameText("");
  };

  const createNewAct = async () => {
    createNewActMutation.mutate(newActNameText);
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
          data?.acts.map((act) => <ActView key={act.id} act={act}/>)
        }
      </div>
    </div>
  );
}