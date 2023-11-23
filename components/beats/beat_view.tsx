import * as React from 'react';
import {StyledCard, StyledCardImg, StyledCardTitle, StyledCardDescription, StyledCardFooter} from './beat_view.styled';
import { CardActions, CardContent, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Beat } from "../../types/beats";

interface Props {
  beat: Beat;
  openEditBeatDialog: (beat: Beat) => void;
}

export default function BeatView({ beat, openEditBeatDialog } : Props) {
  const updateClicked = () => {
    openEditBeatDialog(beat);
  };

  const deleteClicked = () => {

  };

  return (
    <StyledCard key={beat.id} sx={{ minWidth: 150, width: 150 + (beat.duration * 1.5) }}>
      <StyledCardImg src="/sample_beatsheet_thumbnail.jpg"/>
      <CardContent style={{ position: "relative" }}>
        <StyledCardTitle>
          { beat.description }
        </StyledCardTitle>
        <StyledCardDescription>
          {`${beat.duration} seconds`}
        </StyledCardDescription>
      </CardContent>
      <StyledCardFooter>
        <IconButton onClick={updateClicked}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={deleteClicked}>
          <DeleteIcon />
        </IconButton>
      </StyledCardFooter>
    </StyledCard>
  );
}