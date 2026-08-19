---
title: EVM Interface Overview
---

# EVM Interface

The **EVM Interface** (formerly the only developer experience in Etherlink) is implemented by an EVM runtime that is designed to be a drop-in replacement for Ethereum-compatible chains: existing Solidity contracts, wallets, SDKs, and tooling work without modification.

The EVM Interface targets full compatibility with the Ethereum ecosystem, but there are a
few differences from Ethereum, detailed at [Compatibility with Ethereum](/evm/developing/compatibility).

## Key features

- **Native token**: tez (XTZ), with 18-decimal precision on the EVM interface (see [Accounts and Aliases](/overview/accounts-and-aliases) for precision conversion details)
- **Cross-interface calls**: EVM contracts can call Michelson contracts atomically via the [NAC gateway](./nac-usage)
- **Account aliases**: Every Tezos account has a deterministic EVM alias address, enabling EVM contracts to interact with Tezos accounts
