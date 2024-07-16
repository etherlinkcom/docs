---
title: Delayed Inbox
---

The Etherlink network uses a centralised sequencer governed by the community.
Etherlink therefore needs to be protected against censorship from the sequencer
until he is replaced by the governance if needed.

## The regular inbox

The sequencer is producing blocks quickly to provide pre-confirmation to users.
Is is then responsible for publishing the blocks to the L1, in a form that we
call "blueprints". The blueprint contains:
1. The list of aggregated transactions.
1. The list of delayed transactions (see the next section).
1. The predecessor block on which they should be processed.
1. The timestamp of the block.

The blueprints are signed by the sequencer, and published to the L1
[Smart Rollup inbox](https://tezos.gitlab.io/alpha/smart_rollups.html#rollups-inbox).
They are then validated by the different rollup node actors on the network.

The sequencer then is responsible for two things:
1. Including your transaction in a blueprint, i.e. not censoring.
1. Publishing the blueprint, i.e. data availability.

## The delayed inbox

The delayed inbox is responsible for two aspects:
1. Allowing to bridge assets from the Tezos Layer1 to the Etherlink Smart Rollup.
1. Force inclusion of transactions if the sequencer is censoring your transactions.

### What is concrectly a delayed inbox

In order to benefit from the low-latency and preconfirmation of the Etherlink network,
transactions are generally forwarded to the sequencer. An alternative is to transmit the
transactions via the delayed inbox directly on L1. These transactions are delayed in the
sense that the workflow does the opposite of a regular transaction cycle in the sequencer.

If you are using a sequencer, the general workflow is:
1. The transaction is sent to the sequencer.
1. Preconfirmation is given in less than 1 second.
1. The transaction is part of a blueprint and published to L1.
1. The transaction is validated by rollup nodes, 20s to 60sec later.

If you use the delayed inbox, the general workflow is rather:
1. The transaction is sent directly to the L1.
1. The transaction is picked by rollup node and added to a specific storage "delayed-inbox".
1. The sequencer monitors this this storage to discover new delayed transactions.
1. The sequencer includes the potential delayed transaction using its hash.
1. When the blueprint including a delayed transaction is published and validated by the
rollup nodes, the transaction is removed from the delayed inbox storage.

### Briding assets

As described in the bridge section (todo link), Etherlink handles tickets forwarded from
the Tezos L1. Therefore, it's not possible to simply ask the sequencer to bridge your assets
on Etherlink. One kind of delayed inbox transaction is a `Deposit` request, when a deposit
is included on the L1, they are added to the delayed inbox by the rollup nodes. Then the sequencer
picks the deposits and include them in the block.

### Overcoming censorship

If the sequencer refuses to include your transaction for some reasons, the transaction can
be submitted via the delayed inbox.

The transaction must be transmitted via the "delayed bridge", a Tezos smart contract:
1. Deployement on mainnet: [KT1AZeXH8qUdLMfwN2g7iwiYYSZYG4RrwhCj](https://better-call.dev/mainnet/KT1AZeXH8qUdLMfwN2g7iwiYYSZYG4RrwhCj)
1. Deployement on ghostnet: [TODO](TODO)

It's a special contract that takes two parameters:
1. The Smart Rollup address of Etherlink.
1. The rlp encoded transaction as bytes.

When an user calls this contract it essentialy does two things:
1. Charge the user 1XTZ to prevent spam on the network. The value 1XTZ is hardcoded and subject
to evolution in the future.
2. Forwards the transaction to the Etherlink Smart Rollup via the inbox.

The contract is whitelisted in the storage of the Etherlink Smart Rollup, and everytime
a transaction comes from this contract, it is added to the delayed inbox. Which can be picked
up by the sequencer later.

### What if the sequencer ignores the delayed inbox?

If a transaction makes it to the delayed inbox, it **must** be included by the sequencer in
a reasonable time. If the delayed transaction has not been included in **12** hours and
at least 1600 L1 blocks, it will be forced automatically.

Note: it's at least 1600 L1 blocks in order to be resilient to a L1 issue, if the network is
stopped for some reasons, we do not want to impact the sequencer if it is behaving correctly.

Forcing the inclusion of delayed inbox works as the following:
1. Everytime the kernel is executed by the rollup node (at every Tezos level), it checks
if one transaction should be forced.
1. If one transaction needs to be forced, all transactions present in the delayed inbox
are popped. These transactions form a new block produced by the kernel and not by the sequencer.

The delayed inbox has therefore precedence over the sequencer. That also mean that if one block
is produced by the kernel another branch will be created, the sequencer and the rollup node will
diverge. It becomes the responsibility of the sequencer to reorganize itself to build blocks
on top of the forced one.

Note that the delayed inbox can be trigerred if the sequencer is behaving incorrectly but also
if the sequencer is down for other reasons. It gives the possibility to use the Etherlink
network as a sequencer-based rollup instead of a centralised sequencer.
