import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThirdwebProvider } from 'thirdweb/react';

// Root component to wrap the entire application
export default function Root({ children }) {

  // Create a client
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}