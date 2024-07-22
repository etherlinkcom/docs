---
title: Etherlink architecture
---

Etherlink's main components are its nodes and the sequencer.

These components are instances of binaries in the [Octez software suite](https://tezos.gitlab.io/introduction/tezos.html).

## High-level diagram

![A high-level diagram of Etherlink architecture, showing the interaction between the nodes and the sequencer](/img/architecture-high-level.png)

## Sequencer

Etherlink relies on a sequencer to publish transactions.
It receives transactions from EVM nodes, puts them in order, and publishes them in two ways:

- It publishes transactions to EVM nodes, which can consider them final as long as they trust that the sequencer will publish them to layer 1.
- It publishes transactions to Tezos layer 1, which finalizes them.

The sequencer is an instance of the `octez-evm-node` binary running in sequencer mode.

## Nodes

Etherlink relies on three types of nodes, with instances of each type running in different modes:

- EVM nodes (`octez-evm-node`): The EVM nodes running in sequencer observer mode maintain a local copy of the Etherlink context and expose a [JSON RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc/)-compliant endpoint for clients to submit transactions to.
They forward these transactions to the sequencer and receive transactions from the sequencer, which they use to update their state.
They also check Smart Rollup nodes to verify that these transactions make it to Tezos layer 1.

- Smart Rollup nodes (`octez-smart-rollup-node`): Smart Rollup nodes store the state of the Etherlink blockchain from the perspective of Tezos layer 1.
  They monitor the Tezos layer 1 Smart Rollup inbox, filter the inbox to Etherlink-related messages, process them, and update their states.

  Importantly, the Smart Rollup nodes store the state of Etherlink based on the information that they get from layer 1, not on information from EVM nodes or the sequencer.

  These Smart Rollup nodes run in different modes depending on the needs of the people who run them.
  The `octez-smart-rollup-node` binary has many different modes, but these are the primary modes for Etherlink:

     - Nodes running in observer mode follow the state of the rollup by monitoring layer 1 and updating their states.
     - Nodes running in operator mode update their states like nodes running in observer mode.
     They also have the critical role of securing the Etherlink Smart Rollup by publishing commitments to layer 1 and playing refutation games.
     - The sequencer can use a node running in batcher mode to publish transactions to layer 1.
     It can also use a node running in operator mode to publish transactions.

  For more information about Smart Rollup nodes in general, see [Smart Rollups](https://docs.tezos.com/architecture/smart-rollups) on docs.tezos.com and [Smart Rollup Node](https://tezos.gitlab.io/shell/smart_rollup_node.html) in the Octez documentation.

- Tezos layer 1 nodes (`octez-node`): Layer 1 nodes are responsible for the state of layer 1.
In addition to ordinary layer 1 transactions, they receive Etherlink transactions from the sequencer.
Then the baking nodes publish the Etherlink transactions in the Smart Rollup inbox in layer 1 blocks.
For more information about Tezos layer 1 and its nodes, see [Architecture](https://docs.tezos.com/architecture) on docs.tezos.com.

## Transaction lifecycle

The overall lifecycle of a typical operation is as follows:

1. A user submits a transaction to an EVM node.
1. The EVM node forwards the transaction to the sequencer.
1. The sequencer puts the transaction in its queue as soon as possible (less than 500ms after receiving it in a nominal scenario).
1. The sequencer puts the transaction into a blueprint, which is a group of Etherlink transactions.
1. The sequencer publishes the blueprint to the EVM nodes, which update their states based on the transactions in the blueprint.
1. The sequencer publishes the blueprint to the Smart Rollup inbox on layer 1 via a Smart Rollup node running in operator or batcher mode.
1. The Smart Rollup nodes tracking the state of Etherlink fetch the blueprint from the Smart Rollup inbox, read its transactions, and update their states.
1. The EVM nodes check the state of the Smart Rollup nodes to verify that blueprints have successfully and faithfully been finalized on layer 1.
1. The Smart Rollup nodes running in observer mode post hashes of Etherlink's state to layer 1 as commitments.

This diagram summarizes the transaction process:

![A more detailed diagram of Etherlink architecture, showing the flow of transactions and blueprints](/img/architecture-full.png)
