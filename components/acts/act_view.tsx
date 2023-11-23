import * as React from 'react';

import { Collapse, IconButton, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import MovieIcon from '@mui/icons-material/Movie';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Act } from "../../types/acts";
import { HorizontalScroll } from "./act_view.styled";
import BeatView from "../beats/beat_view";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  act: Act;
}

export default function ActView({ act } : Props) {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const deleteClicked = () => {

  };

  return (
    <div>
      <ListItemButton onClick={handleClick} style={{ maxWidth: 500 }}>
        <ListItemIcon>
          <MovieIcon />
        </ListItemIcon>
        <ListItemText primary={act.description} />
        {open ? <ExpandLess /> : <ExpandMore />}
        <IconButton disabled onClick={deleteClicked}>
          <DeleteIcon />
        </IconButton>
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <HorizontalScroll>
          { act.beats.map((beat) => <BeatView key={beat.id} beat={beat}/>) }
        </HorizontalScroll>
      </Collapse>
    </div>
  );
}