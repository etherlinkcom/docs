---
title: Tezos X Previewnet test network
---

Tezos X Previewnet is a public test network for previewing upcoming Tezos X features.
Unlike Shadownet, which follows the Mainnet upgrade cycle, Previewnet may run the latest Tezos X features ahead of the other networks so that builders and integrators can test them in advance.
For example, it made the EVM and Michelson interfaces and cross-interface interactions available for experimentation ahead of upgrade 7 on Mainnet.

## Resources

The previewnet repository contains network parameters, configuration, and up-to-date endpoint information:

👉 [https://github.com/trilitech/tezos-x-previewnet](https://github.com/trilitech/tezos-x-previewnet)

## Connecting

The previewnet exposes two RPC endpoints — one per interface:

- **EVM Interface RPC** — compatible with Ethereum JSON-RPC. Connect using MetaMask, ethers.js, viem, or any Ethereum toolchain by pointing to this endpoint.
- **Michelson Interface RPC** — compatible with the Tezos RPC standard. Connect using Octez, Temple wallet, Taquito, or any Tezos toolchain by pointing to this endpoint.

See the previewnet repository for the current endpoint URLs.

## Getting tez

A faucet is available from the previewnet explorer linked in the repository. Tez obtained on the testnet has no real-world value.

## Block explorer

The previewnet ships with an explorer covering both interfaces. The explorer aggregates information from both the EVM and Michelson interface blocks and can display cross-interface call graphs.
