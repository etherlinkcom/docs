---
title: Getting Started
---

# Getting Started with the EVM Interface

This guide walks through connecting an Ethereum wallet, obtaining tez, and interacting with the EVM Interface on the Etherlink<!--TX--> testnet.

## 1. Connect a wallet

Use any Ethereum-compatible wallet that supports custom networks (such as MetaMask).

For detailed wallet connection instructions, see [Using your wallet](/evm/get-started/using-your-wallet).

## 2. Get tez

For information on faucets and obtaining testnet tez, see [Getting Testnet tolkens](/evm/get-started/getting-testnet-tokens).

## 3. Deploy and interact with a smart contract

Once your wallet is funded, you can deploy and interact with Solidity contracts using standard Ethereum tooling:

- Use **Hardhat** or **Foundry** to compile and deploy contracts, pointing to the Etherlink EVM<!--TEVM--> RPC endpoint.
- Use **ethers.js**, **viem**, or **web3.js** to interact with deployed contracts.
- Use the Etherlink<!--TX--> block explorer to inspect transactions and contract state.

For information on network parameters see
[Network information](/evm/get-started/network-information).

For detailed guidance, refer to [Deploying smart contracts](/evm/developing/deploying-contracts) and [Sending transactions](/evm/developing/transactions).

## 4. Try native atomic composability

To call a Michelson contract from a Solidity contract, use the NAC gateway. See [NAC Usage](./nac-usage.md) for the gateway address and call conventions.
For a more hands-on presentation, check the [Cross-interface counter tutorial](/tutorials/nac-counter).
