---
title: Etherlink architecture
---

Etherlink's main components are its nodes and the sequencer.

## Sequencer

Etherlink relies on a sequencer to publish transactions.
It receives transactions from EVM nodes, puts them in order, and publishes them in two ways:

- It publishes transactions to EVM nodes, which can consider them final as long as they trust that the sequencer will publish them to layer 1.
- It publishes transactions to Tezos layer 1, which finalizes them.

## Nodes

In its life cycle, an Etherlink transaction goes through three distinct types of nodes.
These three nodes are being developed as part of the [Octez software suite](https://tezos.gitlab.io/introduction/tezos.html):

- EVM nodes (`octez-evm-node`): The EVM nodes maintain a local copy of the Etherlink context and expose a [JSON RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc/)-compliant endpoint for clients to submit transactions to.
They forward these transactions to the sequencer and receive transactions from the sequencer, which they use to update their state.
They also check Smart Rollup nodes to verify that these transactions make it to Tezos layer 1.
- Smart Rollup nodes (`octez-smart-rollup-node`): Smart Rollup nodes store the state of the Etherlink blockchain from the perspective of Tezos layer 1.
  They monitor the Tezos layer 1 Smart Rollup inbox, filter the inbox to Etherlink-related messages, process them, and update their states.

  Importantly, the Smart Rollup nodes store the state of Etherlink based on the information that they get from layer 1, not on information from EVM nodes or the sequencer.

  For more information about Smart Rollup nodes in general, see [Smart Rollups](https://docs.tezos.com/architecture/smart-rollups) on docs.tezos.com and [Smart Rollup Node](https://tezos.gitlab.io/shell/smart_rollup_node.html) in the Octez documentation.
- Tezos layer 1 nodes (`octez-node`): Layer 1 nodes are responsible for the state of layer 1.
In addition to ordinary layer 1 transactions, they receive Etherlink transactions from the sequencer.
Then the baking nodes publish the Etherlink transactions in the Smart Rollup inbox in layer 1 blocks.
For more information about Tezos layer 1 and its nodes, see [Architecture](https://docs.tezos.com/architecture) on docs.tezos.com.

## Diagram

This diagram summarizes the interaction between the nodes and the sequencer:

![A high-level diagram of Etherlink architecture, showing the interaction between the nodes and the sequencer](/img/architecture.png)

## Transaction lifecycle

The overall lifecycle of a typical operation is as follows:

1. A user submits a transaction to an EVM node.
1. The EVM node forwards the transaction to the sequencer.
1. The sequencer puts the transaction in its queue as soon as possible (less than 500ms after receiving it in a nominal scenario).
1. The sequencer publishes the transaction to the EVM nodes.
1. The sequencer publishes the transaction to layer 1.
1. The Smart Rollup nodes tracking the state of Etherlink fetch the new Etherlink transactions from layer 1 and update their states.
1. The EVM nodes check the state of the Smart Rollup nodes to verify that transactions have successfully and faithfully been finalized on layer 1.
