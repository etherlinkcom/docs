---
title: Bridging
---

# Bridging

:::caution[In progress]
This page is under construction, the bridging website is being worked out.
Come back soon!
:::

In the meantime, you can [bridge tokens to the EVM interface](/evm/bridging/) and control them via [Native Atomic Composability (NAC)](/michelson/nac-usage).

## What the Michelson interface bridges

**Native tez** can be moved between Tezos layer 1 and the Michelson interface; the bridging UI for this path is under construction.

**FA tokens** are deliberately not bridged to the Michelson interface directly.
Bridging the same token to both interfaces would create two wrapped versions of it on the same chain.
Instead, tokens bridged to the [EVM interface](/evm/bridging/) remain the single canonical representation, and Michelson contracts use them directly via [NAC](/michelson/nac-usage).
