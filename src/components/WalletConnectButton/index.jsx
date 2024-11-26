import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import { createThirdwebClient } from 'thirdweb';
import { ConnectButton, ThirdwebProvider, lightTheme } from 'thirdweb/react';

const customTheme = lightTheme({
  colors: {
    primaryText: 'black',
    primaryButtonBg: '#38ff9c',
    primaryButtonText: 'black',
    secondaryButtonBg: '#59ad8c',
    connectedButtonBgHover: '#59ad8c',
    borderColor: '#59ad8c'
  },
});

const testnet = {
  chainId: 128123,
  rpc: "https://node.ghostnet.etherlink.com",
  nativeCurrency: {
    decimals: 18,
    name: "XTZ",
    symbol: "XTZ",
  },
  // shortName: "etherlink",
  // slug: "etherlink",
  testnet: true,
  // chain: "Etherlink",
  name: "Etherlink Testnet",
};

const mainnet = {
  chainId: 42793,
  rpc: "https://node.mainnet.etherlink.com",
  nativeCurrency: {
    decimals: 18,
    name: "XTZ",
    symbol: "XTZ",
  },
  // shortName: "etherlink",
  // slug: "etherlink",
  testnet: false,
  // chain: "Etherlink",
  name: "Etherlink Mainnet",
};

export default function WalletConnectButton({ network, title }) {

  const {
    siteConfig: {customFields},
  } = useDocusaurusContext();

  const activeChain = network === "mainnet" ? mainnet : testnet;

  const dAppMeta = {
    name: "Etherlink documentation",
    description: "Connect your wallet to Etherlink",
    logoUrl: "https://etherlink.com/logo.png",
    url: "https://etherlink.com",
    isDarkMode: true,
  };

  const client = createThirdwebClient({ clientId: customFields.THIRDWEB_CLIENT_ID });

  return (
    <ThirdwebProvider activeChain={activeChain} clientId={customFields.THIRDWEB_CLIENT_ID}>
      <ConnectButton
        client={client}
        appMetadata={dAppMeta}
        theme={customTheme}
        connectButton={{ label: title }}
        chain={activeChain} // Causes errors
      />
    </ThirdwebProvider>
  )
}
