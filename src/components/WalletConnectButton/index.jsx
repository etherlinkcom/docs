import { ConnectButton, lightTheme } from 'thirdweb/react';
import { createThirdwebClient } from 'thirdweb';
import { inAppWallet, createWallet } from "thirdweb/wallets";
import { defineChain } from "thirdweb/chains";
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

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

const ghostnetTestnet = defineChain({
  id: 128123,
  rpc: "https://node.ghostnet.etherlink.com",
  nativeCurrency: {
    decimals: 18,
    name: "XTZ",
    symbol: "XTZ",
  },
  shortName: "etherlink",
  slug: "etherlink",
  testnet: true,
  chain: "Etherlink",
  name: "Etherlink Ghostnet Testnet",
});

const shadownetTestnet = defineChain({
  id: 127823,
  rpc: "https://node.shadownet.etherlink.com",
  nativeCurrency: {
    decimals: 18,
    name: "XTZ",
    symbol: "XTZ",
  },
  shortName: "etherlink",
  slug: "etherlink",
  testnet: true,
  chain: "Etherlink",
  name: "Etherlink Shadownet Testnet",
});

const mainnet = defineChain({
  id: 42793,
  rpc: "https://node.mainnet.etherlink.com",
  nativeCurrency: {
    decimals: 18,
    name: "XTZ",
    symbol: "XTZ",
  },
  shortName: "etherlink",
  slug: "etherlink",
  testnet: false,
  chain: "Etherlink",
  name: "Etherlink Mainnet",
});

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];

export default function WalletConnectButton({ network, title }) {

  let activeChain;
  switch (network) {
    case "ghostnet":
      activeChain = ghostnetTestnet;
      break;
    case "shadownet":
      activeChain = shadownetTestnet;
      break;
    default:
      activeChain = mainnet;
      break;
  }

  const dAppMeta = {
    name: "Etherlink documentation",
    description: "Connect your wallet to Etherlink",
    logoUrl: "/img/site/etherlinkIcon.svg",
    url: "https://docs.etherlink.com",
    isDarkMode: true,
  };

  const {
    siteConfig: {customFields},
  } = useDocusaurusContext();

  const client = createThirdwebClient({ clientId: customFields.THIRDWEB_CLIENT_ID });

  return (
    <ConnectButton
      client={client}
      appMetadata={dAppMeta}
      wallets={wallets}
      theme={customTheme}
      connectButton={{ label: title }}
      chain={activeChain}
      connectModal={{
        title: title,
        titleIcon: "/img/site/etherlinkIcon.svg",
        size: "compact",
      }}
      style={{
        '&:hover': {
          opacity: 0.8,
          filter: 'brightness(0.8)',
          backgroundColor: '#38ff9c !important'
        },
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
      }}
    />
  )
}
