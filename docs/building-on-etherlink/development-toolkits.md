---
title: Development toolkits
dependencies:
  hardhat: 3.0.14
---

## 👷 Hardhat

[Hardhat](https://hardhat.org/) is an Ethereum development environment for professionals. It facilitates performing frequent tasks, such as running tests, automatically checking code for mistakes or interacting with a smart contract. To get started, check out the [Hardhat documentation](https://hardhat.org/docs) or the [Etherlink tutorial](/tutorials/predictionMarket).

### Using Hardhat with Etherlink

Hardhat works seamlessly with Etherlink.
You can follow the documentation at https://hardhat.org/docs and insert values for Etherlink.

Here is an example `hardhat.config.js` file for Etherlink Mainnet and Ghostnet Testnet:

```javascript
module.exports = {
  solidity: "0.8.24",
  networks: {
    etherlinkMainnet: {
      url: "https://node.mainnet.etherlink.com",
      accounts: ["<YOUR_PRIVATE_KEY>"],
    },
    etherlinkTestnet: {
      url: "https://node.shadownet.etherlink.com",
      accounts: ["<YOUR_PRIVATE_KEY>"],
    },
  },
  etherscan: {
    apiKey: {
      etherlinkMainnet: "YOU_CAN_COPY_ME",
      etherlinkTestnet: "YOU_CAN_COPY_ME",
    },
    customChains: [
      {
        network: "etherlinkMainnet",
        chainId: 42793,
        urls: {
          apiURL: "https://explorer.etherlink.com/api",
          browserURL: "https://explorer.etherlink.com",
        },
      },
      {
        network: "etherlinkShadownet",
        chainId: 127823,
        urls: {
          apiURL: "https://shadownet.explorer.etherlink.com/api",
          browserURL: "https://shadownet.explorer.etherlink.com",
        },
      },
    ],
  },
};
```

### Deploying and verifying contracts with Hardhat

Hardhat offers great guides for [deploying](https://hardhat.org/hardhat-runner/docs/guides/deploying) and [verifying](https://hardhat.org/hardhat-runner/docs/guides/verifying) your contracts. Just make sure to set the network flag appropriately: `--network etherlinkMainnet` or `--network etherlinkTestnet`, as appropriate.

## 🔥 Foundry

[Foundry](https://book.getfoundry.sh/) is a fast, portable and modular toolkit for Ethereum application development written in Rust. It consists of various subpackages:

**Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).\
**Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.\
**Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.\
**Chisel**: Fast, utilitarian, and verbose solidity REPL.

### Deploying and verifying contracts with Foundry

For the most up to date information on how to deploy and verify a smart contract, check out the [guide](https://book.getfoundry.sh/forge/deploying) provided by the Foundry team!

As a summary, you can run the following command for Etherlink:

```bash
forge create --rpc-url "https://node.mainnet.etherlink.com" \
    --private-key "<YOUR_PRIVATE_KEY>" \
    --etherscan-api-key "YOU_CAN_COPY_ME" \
    --verify \
    src/YOUR_CONTRACT.sol:YOUR_CONTRACT --legacy
```

To use Etherlink Shadownet Testnet, substitute the RPC URL `https://node.shadownet.etherlink.com` for the Mainnet URL.
