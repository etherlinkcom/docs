import { ThirdwebProvider, metamaskWallet, localWallet, walletConnect, ConnectWallet, lightTheme } from "@thirdweb-dev/react";

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

export default function WalletConnectButtons() {
  const activeChain = {
    chainId: 128123,
    rpc: ["https://node.ghostnet.etherlink.com"],
    nativeCurrency: {
      decimals: 18,
      name: "XTZ",
      symbol: "XTZ",
    },
    shortName: "etherlink",
    slug: "etherlink",
    testnet: true,
    chain: "Etherlink",
    name: "Etherlink Testnet",
  };

  const dAppMeta = {
    name: "Etherlink Testnet Faucet",
    description: "Drip Testnet XTZ",
    logoUrl: "https://etherlink.com/logo.png",
    url: "https://etherlink.com",
    isDarkMode: true,
  };

  return (
    <ThirdwebProvider clientId="process.env.THIRDWEB_CLIENT_ID"
      activeChain={activeChain}
      supportedWallets={[
        metamaskWallet({ recommended: true }),
        walletConnect(),
        localWallet(),
        // embeddedWallet({
        //   auth: {
        //     options: ["email", "apple", "google"],
        //   },
        // }),
        // phantomWallet({ recommended: true }),
      ]}
      dAppMeta={dAppMeta}>
      <ConnectWallet
        switchToActiveChain={true}
        theme={customTheme}
        modalSize={"wide"}
        // btnTitle="Connect Etherlink To Metamask"
      />
    </ThirdwebProvider>

  )
}
