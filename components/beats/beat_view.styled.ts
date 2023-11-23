import styled from "styled-components";
import Card from '@mui/material/Card';

export const StyledCard = styled(Card)`
  position: relative;
  margin: 1rem;
  flex-shrink: 0;
  height: 350px;
`;

export const StyledCardImg = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`

export const StyledCardTitle = styled.div`
  width: 100%;
  font-size: 1.1rem;
  font-weight: normal;
  text-align: center;
`

export const StyledCardDescription = styled.div`
  width: 100%;
  font-size: 1rem;
  margin-top: 0.4rem;
  color: darkgrey;
  font-weight: normal;
  text-align: center;
`

export const StyledCardFooter = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  justify-content: end;
`