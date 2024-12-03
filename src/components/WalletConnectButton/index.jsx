import { Button } from '@mui/material';

const customTheme = {
  colors: {
    primaryText: 'black',
    primaryButtonBg: '#38ff9c',
    primaryButtonText: 'black',
    secondaryButtonBg: '#59ad8c',
    connectedButtonBgHover: '#59ad8c',
    borderColor: '#59ad8c'
  },
};

const ghostnet = {
  // chainId: '128123',
  chainId: '0x1F47B',
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
  blockExplorerUrls: ["https://testnet.explorer.etherlink.com/"],
};

const mainnet = {
  // chainId: 42793,
  chainId: '0xA729',
  rpc: ["https://node.mainnet.etherlink.com"],
  nativeCurrency: {
    decimals: 18,
    name: "XTZ",
    symbol: "XTZ",
  },
  shortName: "etherlink",
  slug: "etherlink",
  testnet: true,
  chain: "Etherlink",
  name: "Etherlink Mainnet",
  blockExplorerUrls: ["https://explorer.etherlink.com/"],
};

export default function WalletConnectButton({ network, title }) {

  const activeChain = network === "mainnet" ? mainnet : ghostnet;

  const dAppMeta = {
    name: "Etherlink documentation",
    description: "Connect your wallet to Etherlink",
    logoUrl: "https://etherlink.com/logo.png",
    url: "https://etherlink.com",
    isDarkMode: true,
  };

  return (
    <Button
      variant="contained"
      onClick={async () => {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: activeChain.chainId,
            chainName: activeChain.name,
            rpcUrls: activeChain.rpc,
            // iconUrls:
            nativeCurrency: activeChain.nativeCurrency,
            blockExplorerUrls: activeChain.blockExplorerUrls,
          }],
        });
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{chainId: activeChain.chainId}],
        });
      }}
    >{title}</Button>
  )
}
