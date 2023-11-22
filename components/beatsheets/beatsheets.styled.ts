import styled from "styled-components";
import Card from '@mui/material/Card';
import { Button } from "@mui/material";

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const AddActButton = styled(Button)`
  height: 40px;
  width: 150px;
  margin-left: 1rem;
`

export const StyledCard = styled(Card)`
`;

export const StyledCardImg = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`

export const StyledCardTitle = styled.span`
  width: 100%;
  font-size: 1.2rem;
  font-weight: bold;
`