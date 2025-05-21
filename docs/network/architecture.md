---
title: Etherlink architecture
---

Etherlink's main components are its nodes and the sequencer.
The sequencer and nodes handle blocks, but they create and handle blocks in a way different from Tezos layer 1.
Some major differences are that only the sequencer can create blocks and that the timing for blocks changes based on the demand.

These components are instances of binaries in the [Octez software suite](https://octez.tezos.com/docs/introduction/tezos.html).

## High-level diagram

![A high-level diagram of Etherlink architecture, showing the interaction between the nodes and the sequencer](/img/architecture-high-level.png)

## Sequencer

Etherlink relies on a sequencer to publish transactions.
The sequencer receives transactions from EVM nodes, puts them in order, and packages them into an Etherlink block.

If the Tezos [Data Availability Layer](https://docs.tezos.com/architecture/data-availability-layer) (DAL) is active, the sequencer has the option to publish the block via the DAL if capacity requires it; otherwise, it publishes the block directly to Tezos layer 1.

The sequencer generates blocks at a variable rate, depending on demand.
Currently, it generates a block at least every 6 seconds, even if the block is empty.
As demand increases, it generates blocks more quickly, up to a block every 500ms.
These values can change with Etherlink upgrades.

Each Etherlink block contains:

- A list of transactions
- A list of transactions that are currently in the delayed inbox, as described in [Transaction lifecycle](#transaction-lifecycle)
- The hash of the previous block
- The timestamp of the block.

The sequencer publishes each block in two ways:

- It publishes them to EVM nodes, which can consider the transactions final as long as they trust that the sequencer will publish them to layer 1.
- It publishes them via the DAL or directly to Tezos layer 1, which finalizes the transactions.

The sequencer is the primary way that Etherlink transactions are processed.
However, to protect the system from censorship and any other problems with the sequencer, Etherlink provides a backup way of handling transactions; see [Transaction lifecycle](#transaction-lifecycle).

The sequencer is an instance of the `octez-evm-node` binary running in sequencer mode.
Only members of the Sequencer Committee can run instances of the sequencer in sequencer mode.

The sequencer is an instance of the `octez-evm-node` binary running in sequencer mode.

## Nodes

Etherlink relies on three types of nodes, with instances of each type running in different modes:

- EVM nodes (`octez-evm-node`): The EVM nodes running in sequencer observer mode maintain a local copy of the Etherlink context and expose a [JSON RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc/)-compliant endpoint for clients to submit transactions to.
They forward these transactions to the sequencer and receive transactions from the sequencer, which they use to update their state.
They also check Smart Rollup nodes to verify that these transactions make it to Tezos layer 1.

- Smart Rollup nodes (`octez-smart-rollup-node`): Smart Rollup nodes are Octez daemons that run the kernel of a Tezos Smart Rollup.
For more information about Smart Rollup nodes in general, see [Smart Rollup node](https://octez.tezos.com/docs/shell/smart_rollup_node.html) in the Octez documentation.

  Etherlink Smart Rollup nodes run the kernel for the Etherlink Smart Rollup and store the state of the Etherlink blockchain from the perspective of Tezos layer 1.
  They monitor the Tezos layer 1 Smart Rollup inbox, filter the inbox to Etherlink-related messages, process them, and update their states.

  Importantly, the Smart Rollup nodes store the state of Etherlink based on the information that they get from layer 1, not on information from EVM nodes or the sequencer.

  These Smart Rollup nodes run in different modes depending on the needs of the people who run them.
  The `octez-smart-rollup-node` binary has many different modes, but these are the primary modes for Etherlink:

     - Nodes running in observer mode follow the state of the rollup by monitoring layer 1 and updating their states.
     - Nodes running in operator mode update their states like nodes running in observer mode.
     They also have the critical role of securing the Etherlink Smart Rollup by publishing commitments to layer 1 and playing refutation games.
     - The sequencer can use a node running in batcher mode to publish transactions to layer 1.
     It can also use a node running in operator mode to publish transactions.

  For more information about Smart Rollup nodes in general, see [Smart Rollups](https://docs.tezos.com/architecture/smart-rollups) on docs.tezos.com and [Smart Rollup Node](https://octez.tezos.com/docs/shell/smart_rollup_node.html) in the Octez documentation.

- Tezos layer 1 nodes (`octez-node`): Layer 1 nodes are responsible for the state of layer 1.
In addition to ordinary layer 1 transactions, they receive Etherlink transactions from the sequencer.
Then the baking nodes publish the Etherlink transactions in the Smart Rollup inbox in layer 1 blocks.
For more information about Tezos layer 1 and its nodes, see [Architecture](https://docs.tezos.com/architecture) on docs.tezos.com.

## Transaction lifecycle

Etherlink has a standard method of processing transactions and a backup method that protects it from censorship and network problems.

### Standard transaction processing

The lifecycle of a typical operation under normal circumstances is as follows:

1. A user submits a transaction to an EVM node.
1. The EVM node forwards the transaction to the sequencer when it is valid.
If users submit multiple transactions that depend on each other (that is, they have nonces that are not yet valid), the EVM node stores them until they are valid.
1. The sequencer puts the transaction in its pool.
1. The sequencer puts the transaction into a block as soon as possible (less than 500ms after receiving it in a nominal scenario).
1. The sequencer publishes the block to the EVM nodes, which update their states based on the transactions in the block.
1. The sequencer publishes the block to the Smart Rollup inbox on layer 1 via a Smart Rollup node running in operator or batcher mode.
1. The Smart Rollup nodes tracking the state of Etherlink fetch the block from the Smart Rollup inbox, read its transactions, and update their states.
1. The EVM nodes check the state of the Smart Rollup nodes to verify that blocks have successfully and faithfully been finalized on layer 1.
1. The Smart Rollup nodes running in operator mode post hashes of Etherlink's state to layer 1 as commitments.

This diagram summarizes the transaction process:

![A more detailed diagram of Etherlink architecture, showing the flow of transactions and blocks](/img/architecture-full.png)
<!-- https://lucid.app/lucidchart/b363063d-f1fe-4081-a717-f7ae9dae4242/edit -->

### Delayed inbox transaction processing

Under normal circumstances, the sequencer handles all incoming transactions fairly and packages them into blocks to finalize them.
If the sequencer doesn't include transactions promptly for any reason, Etherlink provides a backup method of processing transactions that does not rely on the sequencer.
This method allows users to add transactions to an area of storage called the _delayed inbox_ and to force Etherlink to include them.

Transactions that run via the delayed inbox follow this lifecycle:

1. A user submits an Etherlink transaction to a Tezos layer 1 smart contract called the "delayed bridge" contract.
This transaction includes the address of the Etherlink Smart Rollup and the transaction to run on Etherlink encoded via recursive-length prefix (RLP).
The user must also include 1 tez with the transaction to prevent spam; this amount is hardcoded in the smart contract and is subject to change.
1. The delayed bridge contract writes the transaction to the Smart Rollup inbox.
1. The Etherlink Smart Rollup nodes receive the message, verify that it came from the delayed bridge contract by checking its address, and add it to the delayed inbox, which is a specific area of storage named `delayed-inbox`.
This address is hard-coded in the Etherlink kernel.

   At this point, the sequencer has 12 hours or 1600 layer 1 blocks to include the transaction, whichever is longer.
   This delay is to give the sequencer time to catch up if it is trying to include transactions normally and the network is slow for some reason.

1. If the sequencer is running normally, it processes the transaction in the delayed inbox in the same way that it processes other transactions.
Then, when the Smart Rollup nodes receive the block with the transaction as in the standard transaction process, they remove it from the delayed inbox.
The only way to remove a transaction from the delayed inbox is to process it.
1. If the sequencer has not included the transaction at the end of the delay, the Smart Rollup nodes take over the block creation process by following these steps:

   1. Each time the Smart Rollup nodes run the Etherlink kernel (at every layer 1 block level), they check to see if the delay has passed for any delayed inbox transactions.
   1. If any transaction needs to be forced, the nodes retrieve all transactions in the delayed inbox, even if they haven't been in the delayed inbox longer than the delay.
   1. The nodes package these transactions into a block and process the transactions in the same way as they process transactions in blocks that come from the sequencer.

   In this way, transactions in the delayed inbox take precedence over the sequencer.
   If the kernel (via the Smart Rollup nodes) generates a block, that block results in a new branch of the Etherlink chain, and the states of the sequencer and the Smart Rollup nodes diverge.
   It becomes the responsibility of the sequencer to reorganize itself to build blocks on top of the kernel-generated block.

To submit a transaction to the delayed inbox, see [Sending transactions to the delayed inbox](/building-on-etherlink/transactions#sending-transactions-to-the-delayed-inbox).
