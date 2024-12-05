import { useState } from 'react';
import { Button } from '@mui/base/Button';
import { styled } from '@mui/system';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const testnet = {
  // chainId: '128123',
  chainId: '0x1f47b',
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
  chainId: '0xa729',
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

function WalletConnectButton({ title, onButtonClick }) {
  return (
    <StyledButton
      variant="contained"
      onClick={onButtonClick}
    >{title}</StyledButton>
  );
}

export default function WalletConnectionButtonTable() {

  const { siteConfig } = useDocusaurusContext();
  const logoUrl = siteConfig.url + useBaseUrl("/img/Logo-05.svg");

  async function connectButtonClick(clickedChain, setConnected) {
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
          chainId: clickedChain.chainId,
          chainName: clickedChain.name,
          rpcUrls: clickedChain.rpc,
          iconUrls: [logoUrl],
          nativeCurrency: clickedChain.nativeCurrency,
          blockExplorerUrls: clickedChain.blockExplorerUrls,
        }],
      });

      const newActiveChainId = await window.ethereum.request({
        method: "eth_chainId",
      });
      setActiveChainId(newActiveChainId);
      setConnected(true);
    } catch (error) {
      // Do nothing; already connected
    }
  }

  // Currently connected chain ID
  const [activeChainId, setActiveChainId] = useState('');

  const [isMainnetConnected, setIsMainnetConnected] = useState(false);
  const [isTestnetConnected, setIsTestnetConnected] = useState(false);

  function getTitle(network, isConnected) {
    let title = "Connect to " + network.name;
    if (isConnected && activeChainId.toUpperCase() === network.chainId.toUpperCase()) {
      title = "Connected";
    }
    if (isConnected && activeChainId.toUpperCase() !== network.chainId.toUpperCase()) {
      title = "Switch network";
    }
    return title;
  }

  return (
    <table class="customTableContainer">
      <thead>
        <tr>
          <th>Mainnet</th>
          <th>Testnet</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <WalletConnectButton
              title={getTitle(mainnet, isMainnetConnected)}
              onButtonClick={() => connectButtonClick(mainnet, setIsMainnetConnected)}
            />
          </td>
          <td>
            <WalletConnectButton
              title={getTitle(testnet, isTestnetConnected)}
              onButtonClick={() => connectButtonClick(testnet, setIsTestnetConnected)}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
