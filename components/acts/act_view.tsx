import * as React from 'react';
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

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
import { Beat, CameraAngle } from "../../types/beats";

interface Props {
  addBeatMutation: UseMutationResult;
  deleteActMutation: UseMutationResult;
  editBeatMutation: UseMutationResult;
  deleteBeatMutation: UseMutationResult;
  act: Act;
}

export default function ActView({ editBeatMutation, act, addBeatMutation, deleteActMutation, deleteBeatMutation } : Props) {
  const [open, setOpen] = React.useState(true);
  const [deleteActDialogOpen, setDeleteActDialogOpen] = React.useState<boolean>(false);
  const [addBeatDialogOpen, setAddBeatDialogOpen] = React.useState<boolean>(false);
  const [deleteBeatDialogOpen, setDeleteBeatDialogOpen] = React.useState<boolean>(false);

  const [newBeatDescriptionText, setNewBeatDescriptionText] = React.useState<string>("");
  const [newBeatDuration, setNewBeatDuration] = React.useState<number | null>(null);
  const [isUpdatingBeatId, setIsUpdatingBeatId] = React.useState<number | null>(null);
  // TODO: Right now this is hard coded ideally we would get this enum from the backend
  const [newBeatCameraAngle, setNewBeatCameraAngle] = React.useState<CameraAngle | null>(null);

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
    setIsUpdatingBeatId(null);
    setNewBeatDescriptionText("");
    setNewBeatDuration(null);
    setNewBeatCameraAngle(null);
  };

  const handleDeleteBeatDialogClose = () => {
    setDeleteBeatDialogOpen(false);
    setIsUpdatingBeatId(null);
  };

  const openEditBeatDialog = (beat: Beat) => {
    setIsUpdatingBeatId(beat.id);
    setNewBeatDescriptionText(beat.description);
    setNewBeatDuration(beat.duration);
    setNewBeatCameraAngle(beat.cameraAngle);
    setAddBeatDialogOpen(true);
  };

  const deleteBeatClicked = (beat: Beat) => {
    setDeleteBeatDialogOpen(true);
    setIsUpdatingBeatId(beat.id);
  };

  const doDeleteAct = () => {
    deleteActMutation.mutate(act.id);
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

  const doUpdateBeat = () => {
    editBeatMutation.mutate({
      beatId: isUpdatingBeatId,
      description: newBeatDescriptionText,
      duration: newBeatDuration,
      cameraAngle: newBeatCameraAngle,
    });
    setAddBeatDialogOpen(false);
  };

  const doDeleteBeat = () => {
    deleteBeatMutation.mutate(isUpdatingBeatId);
    setDeleteBeatDialogOpen(false);
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
      <Dialog open={deleteBeatDialogOpen} onClose={handleDeleteBeatDialogClose}>
        <DialogTitle>Delete Beat</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you use you want to delete this beat?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleDeleteBeatDialogClose}>Cancel</Button>
          <Button variant="contained" color="warning" onClick={doDeleteBeat}>Delete</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={addBeatDialogOpen} onClose={handleAddBeatDialogClose}>
        <DialogTitle>{isUpdatingBeatId ? "Update Beat" : "Add New Beat"}</DialogTitle>
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
          <Button
            variant="contained"
            color="primary"
            disabled={!newBeatDescriptionText || !newBeatDuration || !newBeatCameraAngle}
            onClick={isUpdatingBeatId ? doUpdateBeat : doAddBeat}
          >
            {isUpdatingBeatId ? "Update" : "Add"}
          </Button>
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
          { act.beats.map((beat) => <BeatView key={beat.id} beat={beat} openEditBeatDialog={openEditBeatDialog} openDeleteBeatDialog={deleteBeatClicked} />) }
        </HorizontalScroll>
      </Collapse>
    </div>
  );
}