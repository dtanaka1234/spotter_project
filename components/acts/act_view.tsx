import * as React from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Button,
  Collapse,
  IconButton,
  InputAdornment, InputLabel,
  ListItemButton,
  ListItemIcon,
  ListItemText, MenuItem, Select,
  TextField
} from "@mui/material";
import MovieIcon from '@mui/icons-material/Movie';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Act } from "../../types/acts";
import { HorizontalScroll, HeaderContainer } from "./act_view.styled";
import BeatView from "../beats/beat_view";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import { CameraAngle } from "../../types/beats";

interface Props {
  beatsheetId: number;
  act: Act;
}

export default function ActView({ beatsheetId, act } : Props) {
  const [open, setOpen] = React.useState(false);
  const [deleteActDialogOpen, setDeleteActDialogOpen] = React.useState<boolean>(false);

  const [addBeatDialogOpen, setAddBeatDialogOpen] = React.useState<boolean>(false);
  const [newBeatDescriptionText, setNewBeatDescriptionText] = React.useState<string>("");
  const [newBeatDuration, setNewBeatDuration] = React.useState<number | null>(null);
  // TODO: Right now this is hard coded ideally we would get this enum from the backend
  const [newBeatCameraAngle, setNewBeatCameraAngle] = React.useState<CameraAngle | null>(null);

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

  const addBeatMutation = useMutation<any, any, any, any>({
    mutationFn: ({ actId, description, duration, cameraAngle }) => {
      return fetch("/api/beat", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ actId, description, duration, cameraAngle }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actsList', beatsheetId] })
    },
  } as any);

  const handleClick = () => {
    setOpen(!open);
  };

  const addClicked = () => {
    setAddBeatDialogOpen(true);
  };

  const deleteClicked = () => {
    setDeleteActDialogOpen(true);
  };

  const handleDeleteActDialogClose = () => {
    setDeleteActDialogOpen(false);
  };

  const handleAddBeatDialogClose = () => {
    setAddBeatDialogOpen(false);
  };

  const doDeleteAct = () => {
    deleteActMutation.mutate();
    setDeleteActDialogOpen(false);
  };

  const doAddBeat = () => {
    addBeatMutation.mutate({
      actId: act.id,
      description: newBeatDescriptionText,
      duration: newBeatDuration,
      cameraAngle: newBeatCameraAngle,
    });
    setAddBeatDialogOpen(false);
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
      <Dialog open={addBeatDialogOpen} onClose={handleAddBeatDialogClose}>
        <DialogTitle>Add New Beat</DialogTitle>
        <DialogContent>
          <TextField
            value={newBeatDescriptionText}
            onChange={(e) => { setNewBeatDescriptionText(e.target.value); }}
            autoFocus
            margin="dense"
            label="Beat Description"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            value={newBeatDuration}
            onChange={(e) => { setNewBeatDuration(parseInt(e.target.value)); }}
            margin="dense"
            label="Beat Duration"
            type="number"
            variant="standard"
            InputProps={{
              endAdornment: <InputAdornment position="start">seconds</InputAdornment>,
            }}
          />
          <InputLabel id="camera-angle-select-label">Camera Angle</InputLabel>
          <Select
            labelId="camera-angle-select-label"
            id="demo-simple-select"
            value={newBeatCameraAngle as any}
            label="Camera Angle"
            style={{ width: 200 }}
            onChange={(e) => { setNewBeatCameraAngle(e.target.value); }}
          >
            <MenuItem value={"ANGLE1"}>Angle 1</MenuItem>
            <MenuItem value={"ANGLE2"}>Angle 2</MenuItem>
            <MenuItem value={"ANGLE3"}>Angle 3</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleAddBeatDialogClose}>Close</Button>
          <Button variant="contained" color="primary" onClick={doAddBeat}>Add</Button>
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
        <IconButton onClick={addClicked}>
          <AddIcon />
        </IconButton>
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