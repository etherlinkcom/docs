---
title: Michelson Interface Overview
---

# Michelson Interface

The **Michelson Interface** is implemented by a Michelson runtime that behaves as closely as possible to Tezos Layer 1, allowing Tezos developers to deploy and run their existing smart contracts on Etherlink<!--TX--> with minimal changes.

The few differences with respect to Tezos Layer 1 are detailed at [Compatibility with Tezos L1](/michelson/developing/compatibility).

## Key features

The Michelson Interface exposes a **Tezos RPC** endpoint, meaning any Tezos-compatible toolchain — wallets, indexers, SDKs, CLIs — can interact with it without modification.

It supports:
- User accounts (tz1, tz2, tz3 addresses)
- Smart contracts (KT1 addresses) written in Michelson or compiled from higher-level languages (SmartPy, LIGO, etc.)
- Standard Tezos operations: transfers, contract originations, delegation, etc.
- FA1.2 and FA2 token standards

Cross-interface calls to and from EVM contracts are available via the [NAC gateway](./nac-usage.md).
