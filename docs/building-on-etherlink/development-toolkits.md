---
title: '🔨 Development Toolkits'
---

## 👷 Hardhat

[Hardhat](https://hardhat.org/) is an Ethereum development environment for professionals. It facilitates performing frequent tasks, such as running tests, automatically checking code for mistakes or interacting with a smart contract. To get started, check out the [tutorial](https://hardhat.org/tutorial) created by the team!

### Using Hardhat with Etherlink

You'll need to add etherlink to the `networks` section in your `hardhat.config.js`:

```
networks: {
    etherlinkTest: {
        url: "https://node.ghostnet.etherlink.com",
        accounts: [process.env.PRIVATE_KEY as string],
    }
}
```

## 🔥 Foundry

[Foundry](https://book.getfoundry.sh/) is a fast, portable and modular toolkit for Ethereum application development written in Rust. It consists of various subpackages:

**Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).\
**Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.\
**Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.\
**Chisel**: Fast, utilitarian, and verbose solidity REPL.

### Using Foundry with Etherlink

For the most up to date information on how to deploy and verify a smart contract, check out the [guide](https://book.getfoundry.sh/forge/deploying) provided by the Foundry team.




