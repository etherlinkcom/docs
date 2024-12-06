import { useState } from 'react';
import { Button } from '@mui/base/Button';
import { styled } from '@mui/system';
import { createThirdwebClient } from 'thirdweb';
import { ConnectButton, ThirdwebProvider, lightTheme } from 'thirdweb/react';
import { inAppWallet, createWallet, injectedProvider } from "thirdweb/wallets";
import { defineChain } from "thirdweb/chains";
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

const testnetChain = defineChain({
  id: 128123,
  name: "Etherlink Testnet",
  rpc: "https://node.ghostnet.etherlink.com",
  blockExplorers: [{
    name: "Block explorer",
    url: "https://testnet.explorer.etherlink.com/",
  }],
  blockExplorerUrl: ["https://testnet.explorer.etherlink.com/"],
  nativeCurrency: {
    decimals: 18,
    name: "XTZ",
    symbol: "XTZ",
  },
});

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

const mainnetChain = defineChain({
  id: 42793,
  name: "Etherlink Mainnet",
  rpc: "https://node.mainnet.etherlink.com",
  blockExplorers: [{
    name: "Block explorer",
    url: "https://explorer.etherlink.com/",
  }],
  blockExplorerUrl: ["https://explorer.etherlink.com/"],
  nativeCurrency: {
    decimals: 18,
    name: "XTZ",
    symbol: "XTZ",
  },
});

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
  '&:hover': {
    opacity: 0.8,
    filter: 'brightness(0.8)',
    backgroundColor: '#38ff9c !important'
  },
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',

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

  const { customFields } = siteConfig;
  const logoUrl = siteConfig.url + useBaseUrl("/img/Logo-05.svg");

  const client = createThirdwebClient({ clientId: customFields.THIRDWEB_CLIENT_ID });

  const [ethBrowser, setEthBrowser] = useState(true);
  async function connectButtonClick(chainObject, setConnected) {
    try {

      if (!window.ethereum) {
        setEthBrowser(false);
        return;
      }

      const wallet = createWallet("io.metamask"); // pass the wallet id

      // if user has wallet installed, connect to it
      if (injectedProvider("io.metamask")) {
        console.log("Got metamask");
        await wallet.connect({
          client,
          chain: chainObject,
        });
      }
      // open WalletConnect modal so user can scan the QR code and connect
      else {
        console.log("No metamask");
        await wallet.connect({
          client,
          walletConnect: { showQrModal: true },
          chain: chainObject,
        });
      }

      const newActiveChainId = await window.ethereum.request({
        method: "eth_chainId",
      });
      setActiveChainId(newActiveChainId);
      setConnected(true);
    } catch (error) {
      // Do nothing; already connected
      console.log(error);
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
          {ethBrowser ?
            <WalletConnectButton
              title={getTitle(mainnet, isMainnetConnected)}
              onButtonClick={() => connectButtonClick(mainnetChain, setIsMainnetConnected)}
            /> :
            <WalletConnectButton
              title='No Wallet Detected'
              onButtonClick={() => null}
            />
          }
          </td>
          <td>
          {ethBrowser ?
            <WalletConnectButton
              title={getTitle(testnet, isTestnetConnected)}
              onButtonClick={() => connectButtonClick(testnetChain, setIsTestnetConnected)}
            /> :
            <WalletConnectButton
              title='No Wallet Detected'
              onButtonClick={() => null}
            />
          }

          </td>
        </tr>
      </tbody>
    </table>
  );
}
