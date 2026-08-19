---
title: Bridging
---

# Bridging

:::caution[In progress]
The bridging web UI does not support the Michelson interface yet.
The mechanisms below work today but require scripts or manual transactions.
:::

## Depositing tez from Tezos layer 1

Native tez can be bridged from Tezos layer 1 directly to a Michelson-interface account.
The flow is the same as [depositing to the EVM interface](/evm/bridging/bridging-tezos): the layer 1 bridge contract wraps the tez in a ticket and forwards it to the Etherlink<!--TX--> Smart Rollup, together with routing data that designates the receiver.
To target a Michelson-interface account, the routing data designates an implicit account (`tz1`, `tz2`, or `tz3`) instead of an EVM address; the kernel rejects deposits that target originated (`KT1`) accounts.

Until the bridging web UI supports this path, you can use the deposit scripts in the [Etherlink bridge repository](https://github.com/baking-bad/etherlink-bridge) (see `scripts/tezos/xtz_deposit_michelson.py`), or deposit to the [EVM interface](/evm/bridging/bridging-tezos) and transfer the tez to your Michelson-interface account.

## Withdrawing tez to Tezos layer 1

Withdrawing directly from a Michelson-interface account is not available yet.
In the meantime, transfer the tez to an EVM-interface account that you control — any transfer to the account's Michelson alias credits it, as described in [Accounts and aliases](/overview/accounts-and-aliases) — and use the standard [EVM withdrawal](/evm/bridging/bridging-tezos#withdrawal-process).

## FA tokens

FA tokens are deliberately not bridged to the Michelson interface directly.
Bridging the same token to both interfaces would create two wrapped versions of it on the same chain.
Instead, tokens bridged to the [EVM interface](/evm/bridging/) remain the single canonical representation, and Michelson contracts use them directly via [Native Atomic Composability (NAC)](/michelson/nac-usage).
