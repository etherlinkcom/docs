---
title: '🤔 Why use Etherlink?'
---

### It's fast

Tezos's 2-block finality guarantee and the speed of its Smart Rollups ensure that transactions are finalized quickly.
Leveraging the latest research with a modified implementation of [Bullshark](https://arxiv.org/abs/2201.05677) with [Shoal](https://medium.com/aptoslabs/shoal-how-we-reduce-bullshark-latency-on-the-aptos-blockchain-44a600d977a1), Etherlink is low latency, with sub-second confirmation times:

<table><thead><tr><th width="170">Chain</th><th width="141.33333333333331">Sequencer</th><th>L2 finality time</th><th>Data posted on L1</th></tr></thead><tbody><tr><td>Etherlink</td><td>Decentralized</td><td>~ 750ms</td><td>~ 15 seconds</td></tr><tr><td>Optimism Bedrock</td><td>Centralized</td><td>~ <a href="https://community.optimism.io/docs/developers/build/differences/#blocks">2 seconds</a></td><td>~ <a href="https://optimistic.etherscan.io/batches">2 minutes</a></td></tr><tr><td>Arbitrum One</td><td>Centralized</td><td>~ <a href="https://arbiscan.io/">300ms</a></td><td>~ <a href="https://arbiscan.io/batches">7 minutes</a></td></tr></tbody></table>

### It's decentralized

Etherlink's decentralized sequencer has no single point of failure, providing high availability, resistance to attacks, and fair transaction ordering.
If the sequencing fails, users have an option to submit to the L1 directly after a delay.

### It's cheap

Etherlink is built on Tezos Smart Rollups, which are enshrined on the platform, meaning that they are implemented directly on layer 1 of the protocol.
However, because Smart Rollups run in their own separate environments, they are not subject to the per-transaction gas fees of layer 1, only small fees when they publish their state to layer 1.
At a load of 200TPS, you can expect an ERC-20 transaction to cost $0.001 on Etherlink.

Smart Rollups also provide standardized communication between layer 1 and other rollups, even those with different execution environments, such as EVM, Michelson, and SVM.
They can retrieve data from outside the Tezos blockchain via the reveal data channel.

For more information about Smart Rollups, see [Scaling on Tezos](../resources/scaling-on-tezos.md).
