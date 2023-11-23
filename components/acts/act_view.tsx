import * as React from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button, Collapse, IconButton, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import MovieIcon from '@mui/icons-material/Movie';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Act } from "../../types/acts";
import { HorizontalScroll, HeaderContainer } from "./act_view.styled";
import BeatView from "../beats/beat_view";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";

interface Props {
  beatsheetId: number;
  act: Act;
}

export default function ActView({ beatsheetId, act } : Props) {
  const [open, setOpen] = React.useState(false);
  const [deleteActDialogOpen, setDeleteActDialogOpen] = React.useState<boolean>(false);

  const queryClient = useQueryClient();

  const deleteActMutation = useMutation<any, any, any, any>({
    mutationFn: (newActName) => {
      return fetch(`/api/act?actId=${act.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actsList', beatsheetId] })
    },
  } as any);

  const handleClick = () => {
    setOpen(!open);
  };

  const deleteClicked = () => {
    setDeleteActDialogOpen(true);
  };

  const handleDeleteActDialogClose = () => {
    setDeleteActDialogOpen(false);
  };

  const doDeleteAct = () => {
    deleteActMutation.mutate();
    setDeleteActDialogOpen(false);
  };

  return (
    <div>
      <Dialog open={deleteActDialogOpen} onClose={handleDeleteActDialogClose}>
        <DialogTitle>Delete Act</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you use you want to delete this act?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleDeleteActDialogClose}>Cancel</Button>
          <Button variant="contained" color="warning" onClick={doDeleteAct}>Delete</Button>
        </DialogActions>
      </Dialog>
      <HeaderContainer>
        <ListItemButton onClick={handleClick} style={{ maxWidth: 500 }}>
          <ListItemIcon>
            <MovieIcon />
          </ListItemIcon>
          <ListItemText primary={act.description} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <IconButton onClick={deleteClicked}>
          <DeleteIcon />
        </IconButton>
      </HeaderContainer>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <HorizontalScroll>
          { act.beats.map((beat) => <BeatView key={beat.id} beat={beat}/>) }
        </HorizontalScroll>
      </Collapse>
    </div>
  );
}