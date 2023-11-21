import type { AppProps } from 'next/app'

import '../styles/global.css';
import styled from "styled-components";

const GlobalPageContainer = styled.div`
  padding: 2rem;
`

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GlobalPageContainer>
      <Component {...pageProps} />
    </GlobalPageContainer>
  );
}