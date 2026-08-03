---
title: Getting Started
---

# Getting Started with the Michelson Interface

This guide walks through connecting a Tezos wallet, obtaining tez, and interacting with the Michelson Interface on the Etherlink<!--TX--> testnet.

## 1. Connect a wallet

Use any Tezos-compatible wallet that supports custom RPC endpoints (see [Wallet Support](./wallet-support.md)).
For network parameters and connection instructions, see [Michelson network information](/michelson/network-information).

## 2. Get tez

For information on faucets and obtaining testnet tez, see [Michelson network information](/michelson/network-information).

## 3. Interact with a smart contract

Once your wallet is funded, you can interact with any Michelson smart contract deployed on Etherlink<!--TX-->. The workflow is identical to Tezos Layer 1:

- Use the Tezos RPC or a higher-level SDK such as **Taquito** to originate contracts and send transactions.
- Use LIGO, SmartPy, or any other Michelson-targeting language to write contracts. Deploy them the same way you would on Tezos L1.
- Block explorers such as TzKT display operations and contract state.

## 4. Try native atomic composability

To call an EVM contract from a Michelson contract, use the NAC gateway. See [NAC Usage](./nac-usage.md) for the gateway address and call conventions.

For an example of how a Michelson contract can be used from the EVM interface, check the [Cross-interface counter tutorial](/tutorials/nac-counter).
