---
title: Dapps
---

# Dapps

For developping distributed applications (dApps) on the Michelson interface, refer to section [Dapps](https://docs.tezos.com/dApps) in the Tezos documentation.

:::note Differences from Tezos layer 1
The Michelson interface is not byte-for-byte layer 1: `simulate_operation` is only partially implemented (which affects fee estimation in tools such as Taquito), the `async` injection mode is not honored yet, and storage costs 1 mutez per byte.
See [Compatibility with Tezos L1](/michelson/developing/compatibility) and the [RPC reference](/michelson/developing/rpc-reference) before porting a workflow.
:::


