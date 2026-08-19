---
title: Tokens
---

# Tokens

Tokens defined and used in the Michelson interface generally adhere to different standards such as FA1.2, FA2, or FA2.1.

Refer to section [Tokens](https://docs.tezos.com/architecture/tokens) in the Tezos documentation for instructions on developing you own tokens.

:::note Differences from Tezos layer 1
The Michelson interface is not byte-for-byte layer 1: `simulate_operation` is only partially implemented (which affects fee estimation in tools such as Taquito), the `async` injection mode is not honored yet, and storage costs 1 mutez per byte.
See [Compatibility with Tezos L1](/michelson/developing/compatibility) and the [RPC reference](/michelson/developing/rpc-reference) before porting a workflow.
:::


