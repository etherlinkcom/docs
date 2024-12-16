/**
 Docusaurus automatically picks up and uses the Root.js file when it's placed in the src/theme directory - it's part of Docusaurus's "swizzling" system.
The way it works is:

- Docusaurus looks for theme components in src/theme
- If it finds a Root.js (or Root.tsx) file there, it automatically uses it to wrap the entire application
- You don't need to import or reference it anywhere else in your code

This is called "component swizzling" in Docusaurus terminology. When you create src/theme/Root.js, you're essentially overriding Docusaurus's default Root component with your own custom version.

 */
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Create a client
const queryClient = new QueryClient();

// Root component to wrap the entire application
export default function Root({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}