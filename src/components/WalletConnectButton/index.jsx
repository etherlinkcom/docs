import { useState, useEffect } from 'react';

export default function WalletConnectButton({ network, title }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [currentChain, setCurrentChain] = useState(null);

  const chainIds = {
    testnet: '128123',
    mainnet: '42793'
  };

  const addNetworkParams = {
    testnet: {
      chainId: "0x1F47B",
      chainName: 'Etherlink Testnet',
      nativeCurrency: {
        name: 'XTZ',
        symbol: 'XTZ',
        decimals: 18
      },
      rpcUrls: ['https://node.ghostnet.etherlink.com'],
    },
    mainnet: {
      chainId: "0xa729",
      chainName: 'Etherlink Mainnet',
      nativeCurrency: {
        name: 'XTZ',
        symbol: 'XTZ',
        decimals: 18
      },
      rpcUrls: ['https://node.mainnet.etherlink.com'],
    }
  };

  useEffect(() => {
    checkConnection();
    checkChain();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkChain = async () => {
    if (window.ethereum) {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setCurrentChain(parseInt(chainId).toString());
    }
  };

  const checkConnection = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setIsConnected(true);
        setAddress(accounts[0]);
        await checkChain();
      }
    }
  };

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length > 0) {
      setIsConnected(true);
      setAddress(accounts[0]);
      await checkChain();
    } else {
      setIsConnected(false);
      setAddress('');
      setCurrentChain(null);
    }
  };

  const handleChainChanged = async (chainId) => {
    setCurrentChain(parseInt(chainId).toString());
  };

  const addNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [addNetworkParams[network]],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        if (!isConnected) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
        }

        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x' + parseInt(chainIds[network]).toString(16) }],
          });
        } catch (switchError) {
            await addNetwork();
        }
      } catch (error) {
        console.error('User rejected connection');
      }
    } else {
      window.open('https://metamask.io/download/', '_blank');
    }
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getButtonText = () => {
    if (!isConnected) {
      return title || 'Connect Wallet';
    }

    if (currentChain === chainIds[network]) {
      return formatAddress(address);
    }

    return 'Switch Network';
  };

  return (
    <button
      onClick={connectWallet}
      style={{
        backgroundColor: '#38ff9c',
        color: 'black',
        border: '1px solid #59ad8c',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: '16px',
        transition: 'all 0.2s ease-in-out',
        minWidth: '160px',
        userSelect: 'none',
        backfaceVisibility: 'hidden',
        WebkitUserSelect: 'none',
        WebkitFontSmoothing: 'antialiased',
        WebkitAppearance: 'none',
        WebkitTapHighlightColor: 'transparent',
        '&:hover': {
          backgroundColor: '#32e589',
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 8px rgba(56, 255, 156, 0.25)',
        },
      }}
      onMouseEnter={e => e.target.style.backgroundColor = '#19b062'}
      onMouseLeave={e => e.target.style.backgroundColor = '#38ff9c'}
    >
      {getButtonText()}
    </button>
  );
}