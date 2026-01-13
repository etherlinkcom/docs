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
- The timestamp of the block

The sequencer publishes each block in two ways:

- It publishes them to EVM nodes
- It publishes them via the DAL or directly to Tezos layer 1

The sequencer is the primary way that Etherlink transactions are processed.
However, to protect the system from censorship and any other problems with the sequencer, Etherlink provides a backup way of handling transactions; see [Transaction lifecycle](#transaction-lifecycle).

The sequencer is an instance of the `octez-evm-node` binary running in sequencer mode.
Only one account can run the sequencer; see [Sequencer governance](/governance/how-is-etherlink-governed#sequencer-governance).

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
1. The sequencer enqueues the transaction and sends an instant confirmation to the nodes that the transaction will be in the next block.
1. The sequencer puts the enqueued transactions into a block as soon as possible (less than 500ms after receiving it in a nominal scenario).
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

## Transaction finality

Transactions are considered finalized when you can trust that they cannot be reversed.

The source of truth of what Etherlink transactions are final is the state of the Smart Rollup, which Etherlink Smart Rollup nodes store and keep up to date.
They catch any misbehavior by the sequencer or other actors, accept only valid transactions, and challenge questionable behavior.
As described in [Refutation periods](https://docs.tezos.com/architecture/smart-rollups#refutation-periods) on docs.tezos.com, Smart Rollup nodes have two weeks to challenge commitments made about the state of a Smart Rollup, although they usually challenge any questionable state as soon as possible.

Therefore, an Etherlink transaction is truly finalized two weeks after the block it is in has been published to Tezos layer 1.
At this point, it is permanently part of the state of the Etherlink Smart Rollup and of Tezos.

However, Etherlink is set up so users can be confident that transactions are irreversible much sooner than that.
Most users can assume that a transaction is irreversible and will be finalized after one of these milestones:

- **The sequencer provides confirmations within 50ms.**
As described in [Getting instant confirmations](/building-on-etherlink/transactions#getting-instant-confirmations), the sequencer notifies the nodes of the transactions that it intends to include in the next block.
The sequencer provides this notification as soon as it enqueues the transaction for the next block, before the transaction has been executed.
Users can subscribe to these notifications via the `tez_newIncludedTransactions` event, as described in [Subscribing to instant confirmations](/building-on-etherlink/websockets#subscribing-to-instant-confirmations).
Users who trust the sequencer and these confirmations can take them as proof that the transaction will be in the next block.

- **Transactions are confirmed on Etherlink within 500ms.**
As described in [Sequencer](#sequencer), the sequencer puts transactions in blocks and distributes them to the EVM nodes.
When the EVM nodes get another block that builds on the previous block, they can trust that the transactions in the previous block are final as long as they trust the that the sequencer will publish them to layer 1.
At this point, the previous block is considered _confirmed_ and it would take a significant bug in the sequencer for it to generate blocks that do not use the confirmed block and thus reorganize the blocks in such a way as to make the confirmed block invalid.

- **Transactions are confirmed on layer 1 in 8 seconds.**
The sequencer also posts blocks to Tezos layer 1.
As with Etherlink blocks, Tezos blocks are confirmed when another block builds on them, as described in [The consensus algorithm](https://octez.tezos.com/docs/active/consensus.html) in the Octez documentation.
Tezos blocks are generated every 8 seconds, so Etherlink transactions are posted and confirmed on Tezos after 8 seconds, when another block is posted.
Etherlink Smart Rollup nodes also pick up these blocks and their instance of the kernel decides immediately whether these blocks are valid and if they should become the next Etherlink block.

   When the Etherlink block has been posted and confirmed on Tezos layer 1, Etherlink treats the block (and the transactions in it) as finalized.
   For example, when you pass the `finalized` parameter to the `eth_getBlockByNumber` RPC endpoint, the EVM node returns not the most recently created block but the block that was most recently posted on layer 1:

   ```bash
   curl --request POST \
        --url https://node.shadownet.etherlink.com \
        --header 'accept: application/json' \
        --header 'content-type: application/json' \
        --data '
   {
     "id": 1,
     "jsonrpc": "2.0",
     "method": "eth_getBlockByNumber",
     "params": ["finalized", false]
   }
   '
   ```

   For this RPC call to work, the EVM node must be following a Smart Rollup node; that is, it must not use the `--dont-track-rollup-node` flag.

After a block containing Etherlink transactions is confirmed on Etherlink and on Tezos layer 1, it is very unlikely that it can be replaced by other blocks (sometimes known as a _reorg_ because it reorganizes the chain of blocks).
Here are two possible but unlikely ways that Etherlink blocks can be reorganized after they are confirmed on layer 1:

- If the sequencer ignores transactions in the delayed inbox as described in [Delayed inbox transaction processing](#delayed-inbox-transaction-processing) for too long, the Smart Rollup nodes process the transactions automatically and generate a block to include those transactions.
This chain may be different from the blocks that the sequencer has posted to layer 1.
In this case, the sequencer automatically reorganizes its blocks to follow the new state of Etherlink.
This type of reorg happens quickly because the Smart Rollup nodes constantly check the delayed inbox and respond quickly when a transaction has been in it for too long.

- As with all [Smart Rollups](https://docs.tezos.com/architecture/smart-rollups), Smart Rollup nodes running in operator or maintenance mode post commitments about their state to Tezos layer 1.
If they execute the kernel honestly, all of their commitments are the same.
If commitments differ, the Smart Rollup nodes play a refutation game to determine the correct commitment and therefore the correct state of Etherlink.
Eliminating these incorrect commitments can mean rejecting blocks that have been confirmed on layer 1.

For these reasons, you can have complete confidence that a transaction is final after the refutation period has elapsed for the block that contains it.
At this point, the commitment that includes this transaction is said to be _cemented_ and therefore final and unchangeable.
