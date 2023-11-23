import * as React from 'react';
import { StyledCard, StyledCardImg, StyledCardTitle, StyledCardDescription } from './beat_view.styled';
import { CardActions, CardContent, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Beat } from "../../types/beats";

interface Props {
  beat: Beat;
}

export default function BeatView({ beat } : Props) {
  const updateClicked = () => {

  };

  const deleteClicked = () => {

  };

  return (
    <StyledCard key={beat.id} sx={{ minWidth: 150, width: 150 + (beat.duration * 1.5) }}>
      <StyledCardImg src="/sample_beatsheet_thumbnail.jpg"/>
      <CardContent>
        <StyledCardTitle>
          { beat.description }
        </StyledCardTitle>
        <StyledCardDescription>
          {`${beat.duration} seconds`}
        </StyledCardDescription>
      </CardContent>
      <CardActions style={{ width: "90%", justifyContent: "flex-end" }}>
        <IconButton onClick={updateClicked}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={deleteClicked}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </StyledCard>
  );
}