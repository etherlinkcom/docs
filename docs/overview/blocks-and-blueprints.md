---
title: Blocks and Blueprints
---

# Blocks and Blueprints

## Blueprints

The sequencer collects operations submitted to all interfaces, orders them in first-in-first-out order, and bundles them into **blueprints**. A blueprint is the sequencer's signed proposal for the next batch of operations. Blueprints are published to the Tezos Layer 1 rollup inbox to be applied by rollup nodes.

## Etherlink<!--TX--> blocks

Applying a blueprint produces a **Etherlink<!--TX--> block**. This block contains the combined effects of all operations from all interfaces processed in that batch.

## Per-interface blocks

From each Etherlink<!--TX--> block, a **per-interface block** is derived at the same level for each interface. A per-interface block only exposes effects that are internal to that interface.

For example:
- A transfer between two Tezos accounts appears only in the Michelson interface block, not in the EVM interface block.
- A cross-runtime call from an EVM contract to a Michelson contract appears in both blocks: the initiating EVM transaction appears in the EVM block, and the resulting Michelson operation appears in the Michelson block, with an event linking the two.

Because per-interface blocks are derived from Etherlink<!--TX--> blocks, a runtime that was introduced after genesis will have its first block at a level greater than zero.

## Block format

Each per-interface block follows the standard format expected by its ecosystem:

- The **EVM interface** block is compatible with the Ethereum JSON-RPC specification. Cross-runtime calls that target the EVM interface are represented as transactions with internal calls, preserving compatibility with existing Ethereum explorers and indexers.
- The **Michelson interface** block follows Tezos operation receipt conventions. Cross-runtime calls targeting the Michelson interface appear as internal operations.

## Block time

The sequencer targets a block time of down to 500 ms under load, providing sub-second
confirmation times.