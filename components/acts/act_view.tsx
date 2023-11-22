import * as React from 'react';

import { Collapse, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import MovieIcon from '@mui/icons-material/Movie';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Act } from "../../types/acts";

interface Props {
  act: Act;
}

export default function ActView({ act } : Props) {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div>
      <ListItemButton onClick={handleClick} style={{ maxWidth: 500 }}>
        <ListItemIcon>
          <MovieIcon />
        </ListItemIcon>
        <ListItemText primary={act.description} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <div>Beats</div>
      </Collapse>
    </div>
  );
}