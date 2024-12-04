import { useState } from 'react';
import { Button } from '@mui/base/Button';
import { styled } from '@mui/system';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const testnet = {
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

const StyledButton = styled(Button)({
  borderRadius: 6,
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 16,
  padding: '6px 12px',
  border: 'none',
  color: 'black',
  lineHeight: 1.5,
  backgroundColor: '#38ff9c',
  borderColor: '#59ad8c',
  fontFamily: [
    'Roboto',
    'system-ui',
    '-apple-system',
    'Segoe UI',
    'Ubuntu',
    'Cantarell',
    'Noto Sans',
    'sans-serif',
    'BlinkMacSystemFont',
    "Segoe UI",
    'Helvetica',
    'Arial',
    'sans-serif',
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol",
  ].join(','),
});

export default function WalletConnectButton({ network, title }) {

  const [chainId, setChainId] = useState(async () => await window.ethereum.request({
      method: "eth_chainId",
  }));

  async function connectButtonClick(activeChain) {
    try {

      if (!window.ethereum) {
        alert('No wallet detected. You need an EVM wallet to connect to Etherlink.')
        return;
      }

      // Connect to network and switch to network
      // Fails if the network is already connected
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: activeChain.chainId,
          chainName: activeChain.name,
          rpcUrls: activeChain.rpc,
          iconUrls: [logoUrl],
          nativeCurrency: activeChain.nativeCurrency,
          blockExplorerUrls: activeChain.blockExplorerUrls,
        }],
      });
      setChainId(activeChain.chainId);
    } catch (error) {
      // Do nothing; already connected
    }
  }

  const activeChain = network === "mainnet" ? mainnet : testnet;

  let buttonLabel = title;
  if (chainId === activeChain.chainId) {
    buttonLabel = "Connected";
  }

  const {siteConfig} = useDocusaurusContext();
  const logoUrl = siteConfig.url + useBaseUrl("/img/Logo-05.svg");

  return (
    <StyledButton
      variant="contained"
      onClick={() => connectButtonClick(activeChain)}
    >{buttonLabel}</StyledButton>
  )
}
