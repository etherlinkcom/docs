---
title: '🔨 Development Toolkits'
---

## 👷 Hardhat

[Hardhat](https://hardhat.org/) is an Ethereum development environment for professionals. It facilitates performing frequent tasks, such as running tests, automatically checking code for mistakes or interacting with a smart contract. To get started, check out the [tutorial](https://hardhat.org/tutorial) created by the team!

### Using Hardhat with Etherlink

It is recommended to use the following config in your `hardhat.config.js` file:

```
module.exports = {
  solidity: "0.8.24",
  networks: {
    etherlinkTestnet: {
      url: "https://node.ghostnet.etherlink.com",
      accounts: ["<YOUR_PRIVATE_KEY>"],
    }
  },
  etherscan: {
    apiKey: {
      etherlinkTestnet: "YOU_CAN_COPY_ME",
    },
    customChains: [
      {
        network: "etherlinkTestnet",
        chainId: 128123,
        urls: {
          apiURL: "https://testnet-explorer.etherlink.com/api",
          browserURL: "https://testnet-explorer.etherlink.com"
        }
      },
    ]
  },
};
```

### Deploying and Verifying Contracts with Hardhat

Hardhat offers great guides for [deploying](https://hardhat.org/hardhat-runner/docs/guides/deploying) and [verifying](https://hardhat.org/hardhat-runner/docs/guides/verifying) your contracts. Just make sure to set the network flag appropriately: `--network etherlinkTestnet`

## 🔥 Foundry

[Foundry](https://book.getfoundry.sh/) is a fast, portable and modular toolkit for Ethereum application development written in Rust. It consists of various subpackages:

**Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).\
**Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.\
**Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.\
**Chisel**: Fast, utilitarian, and verbose solidity REPL.

### Deploying and Verifying Contracts with Foundry

For the most up to date information on how to deploy and verify a smart contract, check out the [guide](https://book.getfoundry.sh/forge/deploying) provided by the Foundry team!

As a summary, you can run the following command:

```bash
forge create --rpc-url "https://node.ghostnet.etherlink.com" \
    --private-key "<YOUR_PRIVATE_KEY>" \
    --etherscan-api-key "YOU_CAN_COPY_ME" \
    --verify \
    src/YOUR_CONTRACT.sol:YOUR_CONTRACT --legacy
```
