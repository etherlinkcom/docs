---
title: Etherlink architecture
---

Etherlink's main components are its nodes and the sequencer.

## Sequencer

Etherlink relies on a sequencer to process transactions in a fair order.
It receives transactions from nodes and packages them into _blueprints_, which are like blocks.
In the context of Etherlink, the transactions in a blueprint are final, but they are not final for layer 1 until they are published on layer 1.

## Nodes

In its life cycle, an Etherlink transaction goes through three distinct types of nodes, each responsible for different aspects of Etherlink's features.
These three nodes are being developed as part of the [Octez software suite](https://tezos.gitlab.io/introduction/tezos.html):

- EVM nodes (`octez-evm-node`): The EVM nodes maintain a local copy of the Etherlink context and expose a [JSON RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc/)-compliant endpoint for clients to submit transactions to.
They forward these transactions to the sequencer and receive blueprints that contain transactions, which they use to update their state.
They also check Smart Rollup nodes to verify that these blueprints make it to Tezos layer 1.
- Smart Rollup nodes (`octez-smart-rollup-node`): Smart Rollup nodes store the state of the Etherlink blockchain from the perspective of Tezos layer 1.

  The sequencer sends new Etherlink blueprints to one dedicated Smart Rollup node and that node publishes those blueprints on Tezos layer 1.

  The other Smart Rollup nodes monitor the Tezos layer 1 rollup inbox for these messages.
  They filter the inbox to Etherlink-related messages, process them, and update their states.

  Importantly, Etherlink transactions are not final on layer 1 until the blueprint that contains them is published on Tezos layer 1.
  The Smart Rollup nodes store the state of Etherlink based on the information that they get from layer 1, not on information from EVM nodes or the sequencer.

  For more information about Smart Rollup nodes in general, see [Smart Rollups](https://docs.tezos.com/architecture/smart-rollups) on docs.tezos.com.
- Tezos layer 1 nodes (`octez-node`): the Smart Rollup Nodes submit layer 1 operations with the blueprints to a layer 1 node.
Layer 1 nodes include these operations in layer 1 blocks.
Other Smart Rollup nodes follow Etherlink by monitoring layer 1 and these operations.

For more information about Tezos layer 1 and its nodes, see [Architecture](https://docs.tezos.com/architecture) on docs.tezos.com.

## Diagram

This diagram summarizes the interaction between the nodes and the sequencer:

![A high-level diagram of Etherlink architecture, showing the interaction between the nodes and the sequencer](/img/architecture.png)

## Transaction lifecycle

The overall lifecycle of a typical operation is as follows:

1. A user submits a transaction to an EVM node.
1. The EVM node forwards the transaction to the sequencer.
1. The sequencer includes the transaction in a new blueprint as soon as possible (less than 500ms after receiving it in a nominal scenario).
1. The sequencer sends the blueprint to a Smart Rollup node running Etherlink's kernel.
1. The sequencer also shares the new blueprint with the EVM nodes for them to update their states.
1. The Smart Rollup node publishes the blueprint to layer 1.
1. The Smart Rollup nodes tracking the state of Etherlink fetch the new Etherlink blueprints from layer 1,  and update their states.
1. The EVM nodes check the state of the Smart Rollup nodes to verify that transactions have successfully and faithfully been finalized on layer 1.
