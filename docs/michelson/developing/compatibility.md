---
title: Compatibility with Tezos L1
---

# Compatibility with Tezos L1

The Michelson Interface is designed to behave as closely as possible to Tezos Layer 1.

## Compatible features

Most of the features, including the following ones work identically to Tezos Layer 1. Therefore, users may safely refer to the corresponding page in the [Tezos documentation](https://docs.tezos.com/) for all these aspects.

## Known differences

The rest of this page documents the known differences between the Michelson interface and Tezos Layer 1.

### Type of Accounts

Not all Tezos account types are supported on Etherlink<!--TX-->, see [Accounts](/michelson/developing/accounts).

### Fees

#### Execution and storage fees are burnt

On Tezos L1, transaction fees are credited to the baker who includes the operation. On Etherlink<!--TX-->, **execution and storage fees are burnt** — there is no equivalent of a baker reward at the Michelson interface level.

#### Inclusion fees are burnt (on the Michelson interface)

Inclusion fees are burned from the Michelson interface's perspective. The sequencer is compensated through the EVM runtime's sequencer pool instead. This means fee balance updates in Michelson receipts do not credit any address.

### Source Accounts

#### SOURCE returns the null address for cross-interface calls

When a transaction is initiated via a cross-interface call (i.e., from the EVM interface), the Michelson `SOURCE` instruction returns the null address `tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU`, not the originating EVM alias. This is because Michelson requires the source to be a user account.

#### Aliases cannot directly hold tez

Michelson aliases (KT1 contracts created for EVM accounts) automatically forward any tez they receive to the originating EVM account via the gateway. You cannot send tez directly to an alias address and retain it there.

One consequence of this is that `SENDER == SELF_ADDRESS` is not a safe test in Etherlink<!--TX-->, see [Self-address test](../self-address).

### Blocks

#### First block level may be greater than zero

If the Michelson runtime was introduced after the chain genesis, its first block will be at a level greater than zero. This differs from a fresh Tezos L1 deployment where the first block is at level 1.

#### Cross-interface operations appear with null source

As a consequence of the fact that "SOURCE returns the null address for cross-interface calls" (see above), operations triggered by cross-runtime calls appear in Michelson runtime blocks with `tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU` as the source. Indexers can cross-reference with the EVM runtime block using the cross-runtime call identifier emitted by the gateway.

### Voting power

The Michelson instructions `VOTING_POWER` and `TOTAL_VOTING_POWER` diverge from L1 at runtime as follows (but typecheck is identical):

- In Etherlink<!--TX-->, they return a hardcoded 0
- In L1, they return the real staking weights.

The rationale is that Etherlink<!--TX--> governance (covering the kernel and sequencer) is managed on Layer 1, by Tezos L1 bakers. There is no governance process directly on Etherlink<!--TX-->, hence no voting power.

### RPCs

Some of the Tezos RPCs are handled differently on Etherlink<!--TX--> with respect to Tezos L1, due to the different context (e.g. no delegation possible), or are not implemented yet.
Refer to [RPC reference](/michelson/developing/rpc-reference).

### Unsupported features

The following features do not apply in a layer 2 context and are intentionally excluded:

- Baking, attestations, delegations, staking
- Smart Rollup operations
- Consensus and governance operations

### Not yet implemented features

The following features from Tezos layer 1 are not yet available in the Michelson Interface:

- BLS addresses (`tz4`)
- Tickets
- Sapling
- Timelocks
- Global constants
