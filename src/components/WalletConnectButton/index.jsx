import { createThirdwebClient } from 'thirdweb';
import { ConnectButton, ThirdwebProvider, lightTheme } from 'thirdweb/react';
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

const ghostnet = defineChain({
  chainId: 128123,
  rpc: ["https://node.ghostnet.etherlink.com"],
  nativeCurrency: {
    decimals: 18,
    name: "XTZ",
    symbol: "XTZ",
  },
  blockExplorers: {
    name: "Testnet block explorer",
    url: "https://testnet.explorer.etherlink.com/",
  },
  shortName: "etherlink",
  slug: "etherlink",
  testnet: true,
  chain: "Etherlink",
  name: "Etherlink Testnet",
});

const mainnet = defineChain({
  chainId: 42793,
  rpc: ["https://node.mainnet.etherlink.com"],
  blockExplorers: {
    name: "Mainnet block explorer",
    url: "https://explorer.etherlink.com/",
  },
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
  inAppWallet({
    auth: {
      options: [
        "google",
        "discord",
        "telegram",
        "farcaster",
        "email",
        "x",
        "passkey",
        "phone",
      ],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];

export default function WalletConnectButton({ network, title }) {

  const {
    siteConfig: {customFields},
  } = useDocusaurusContext();

  const activeChain = network === "mainnet" ? mainnet : ghostnet;

  const dAppMeta = {
    name: "Etherlink documentation",
    description: "Connect your wallet to Etherlink",
    logoUrl: "/img/etherlinkIcon.svg",
    url: "https://etherlink.com",
    isDarkMode: true,
  };

  const client = createThirdwebClient({ clientId: customFields.THIRDWEB_CLIENT_ID });

  return (
    <ThirdwebProvider activeChain={activeChain} clientId={customFields.THIRDWEB_CLIENT_ID}>
      <ConnectButton
        client={client}
        appMetadata={dAppMeta}
        wallets={wallets}
        theme={customTheme}
        connectButton={{ label: title }}
        chain={activeChain}
        connectModal={{
          title: title,
          titleIcon: "/img/etherlinkIcon.svg",
          size: "compact",
        }}
      />
    </ThirdwebProvider>
  );
}
