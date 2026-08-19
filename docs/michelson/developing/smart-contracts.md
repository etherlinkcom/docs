---
title: Smart contracts
---

# Smart contracts

Smart contracts can be developed using the same languages as in Tezos L1 (e.g., SmartPy and LIGO).

Refer to section [Smart contracts](https://docs.tezos.com/smart-contracts) in the Tezos documentation.

:::note Differences from Tezos layer 1
The Michelson interface is not byte-for-byte layer 1: `simulate_operation` is only partially implemented (which affects fee estimation in tools such as Taquito), the `async` injection mode is not honored yet, and storage costs 1 mutez per byte.
See [Compatibility with Tezos L1](/michelson/developing/compatibility) and the [RPC reference](/michelson/developing/rpc-reference) before porting a workflow.
:::


