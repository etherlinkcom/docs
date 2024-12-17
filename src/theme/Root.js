import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThirdwebProvider } from 'thirdweb/react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// Create a client
const queryClient = new QueryClient();

const {
  siteConfig: {customFields},
} = useDocusaurusContext();

// Root component to wrap the entire application
export default function Root({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider clientId={customFields.THIRDWEB_CLIENT_ID}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}