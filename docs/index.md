---
title: '❓ What is Etherlink?'
---

Etherlink is an EVM-compatible layer-2 blockchain with a decentralized sequencer, offering very low fees and MEV protection, powered by Tezos Smart Rollup technology.

* **Decentralized 🌐:** The decentralized sequencer reduces the risk of centralized control and manipulation.
* **Secure 🔒:** Built-in MEV protection protects users against exploitation.
* **Low fees 💰 :** Think &#36;0.01 per transaction, not &#36;20.

Etherlink uses Smart Rollups on the decentralized [Tezos](https://tezos.com) protocol for data availability and will expand to use the Tezos [Data Availability Layer](https://spotlight.tezos.com/data-availability-layer-dal-what-is-it-all-about/).

***

## What does that mean?

* **EVM compatible**: Etherlink runs all Solidity/Vyper smart contracts just like any other EVM chain. All your developer tooling (including [Hardhat](https://hardhat.org/), [Foundry](https://book.getfoundry.sh/), and [Viem](https://viem.sh)) should work out-of-the-box with Etherlink.
* **Smart Rollup**: Smart Rollups are Tezos's permissionless L2 scaling solution. They are WASM applications, providing versatility in what language you write them in. They are optimistic and enshrined:
  * **Optimistic** means that when rollup operators publish a claim about the state of the rollup, the claim is trusted by default. Other operators can easily verify and challenge the claim, and a single honest operator is enough to ensure that the rollup is running honestly.
  * **Enshrined** means that they are implemented as a first-class operation at the protocol level within L1 Tezos, as opposed to using a smart contract on L1 like current Ethereum solutions.
* **Data availability on Tezos**: Smart Rollups store data on Tezos layer 1, making it available to everyone.

***

## Why use Etherlink?

### It's fast

Tezos's 2-block finality guarantee and the speed of its Smart Rollups ensure that transactions are finalized quickly.
Leveraging the latest research with a modified implementation of [Bullshark](https://arxiv.org/abs/2201.05677) with [Shoal](https://medium.com/aptoslabs/shoal-how-we-reduce-bullshark-latency-on-the-aptos-blockchain-44a600d977a1), Etherlink is low latency, with sub-second confirmation times:

<table><thead><tr><th width="170">Chain</th><th width="141.33333333333331">Sequencer</th><th>L2 finality time</th><th>Data posted on L1</th></tr></thead><tbody><tr><td>Etherlink</td><td>Decentralized</td><td>~ 750ms</td><td>~ 15 seconds</td></tr><tr><td>Optimism Bedrock</td><td>Centralized</td><td>~ <a href="https://community.optimism.io/docs/developers/build/differences/#blocks">2 seconds</a></td><td>~ <a href="https://optimistic.etherscan.io/batches">2 minutes</a></td></tr><tr><td>Arbitrum One</td><td>Centralized</td><td>~ <a href="https://arbiscan.io/">300ms</a></td><td>~ <a href="https://arbiscan.io/batches">7 minutes</a></td></tr></tbody></table>

### It's decentralized

Etherlink's decentralized sequencer provides high availability and resistance to attacks.
If the sequencing fails, users have an option to submit to the L1 directly after a delay.

### It's cheap

Etherlink is built on Tezos Smart Rollups, which are enshrined on the platform, meaning that they are implemented directly on layer 1 of the protocol.
However, because Smart Rollups run in their own separate environments, they are not subject to the per-transaction gas fees of layer 1, only small fees when they publish their state to layer 1.
At a load of 50TPS, you can expect an ERC-20 transaction to cost $0.01 or less on Etherlink.

Smart Rollups also provide standardized communication between layer 1 and other rollups, even those with different execution environments, such as EVM, Michelson, and SVM.
They can retrieve data from outside the Tezos blockchain via the reveal data channel.

For more information about Smart Rollups, see [Scaling on Tezos](./resources/scaling-on-tezos.md).

***

## How do I start building on Etherlink?

Great question. Start with this documentation and also join our [Discord](https://discord.gg/etherlink).
