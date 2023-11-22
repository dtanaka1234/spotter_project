import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

import '../styles/global.css';
import styled from "styled-components";

const GlobalPageContainer = styled.div`
  padding: 2rem;
`

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalPageContainer>
        <Component {...pageProps} />
      </GlobalPageContainer>
    </QueryClientProvider>
  );
}