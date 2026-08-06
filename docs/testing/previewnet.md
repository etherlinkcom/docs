---
title: Previewnet test network
---

Previewnet is a public test network running the upgrade-7 feature set ahead of the other networks.
It has allowed builders and integrators to experiment with both the EVM and Michelson interfaces and with cross-interface interactions ahead of the upgrade 7 on Mainnet.

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
