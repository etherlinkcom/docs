import React from 'react';
import { ThirdwebProvider } from "thirdweb/react";
import Provider from '@theme-original/Layout/Provider';

export default function ProviderWrapper(props) {
  return (
    <ThirdwebProvider>
      <Provider {...props} />
    </ThirdwebProvider>
  );
}
