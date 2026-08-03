---
title: Compatibility with Ethereum
---

# Compatibility with Ethereum

The EVM Interface targets compatibility with the Ethereum ecosystem:

- Supports the **Ethereum JSON-RPC** standard
- Supports standard EVM opcodes and precompiles
- Compatible with tooling such as MetaMask, ethers.js, viem, Hardhat, and Foundry

## Differences between Etherlink EVM<!--TEVM--> and Ethereum

While Etherlink EVM<!--TEVM--> is intended to be fully EVM-compatible, it differs in some ways:

- As described in [Ethereum endpoint support](/evm/developing/endpoint-support), Etherlink EVM<!--TEVM--> does not support all EVM RPC endpoints.

- Etherlink EVM<!--TEVM--> calculates gas fees differently; see [Fee structure](/evm/developing/fees).

- Etherlink EVM<!--TEVM--> computes the state world hash with a different function than Ethereum uses.
Therefore it is not compatible with EVM "light clients" that compute states in the way that Ethereum does, with the `Keccak-256` hash function.
Therefore, Etherlink EVM<!--TEVM--> is not compatible with EVM light-client implementations that use this hash function, such as Geth's light client and OpenEthereum.

- Etherlink EVM<!--TEVM--> computes block hashes in a custom way, not including every header field.
Therefore, you cannot compute Etherlink EVM<!--TEVM--> block hashes with tools such as Geth.

