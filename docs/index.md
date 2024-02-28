---
title: '❓ What is Etherlink?'
---

Etherlink is an EVM-compatible layer 2 blockchain with a decentralized sequencer, low gas fees, and fair ordering.

* **Decentralized 🌐:** The decentralized sequencer reduces the risk of centralized control and manipulation.
* **Secure 🔒:** Built-in MEV protection protects users against exploitation.
* **Low fees 💰 :** Think &#36;0.01 per transaction, not &#36;20.

Etherlink uses Smart Rollups on the decentralized [Tezos](https://tezos.com) protocol for data availability and will expand to use the Tezos [Data Availability Layer](https://spotlight.tezos.com/data-availability-layer-dal-what-is-it-all-about/).

***

### What does that mean?

* **EVM compatible**: Etherlink runs all Solidity/Vyper smart contracts just like any other EVM chain. All your developer tooling (including [Hardhat](https://hardhat.org/), [Foundry](https://book.getfoundry.sh/), and [Viem](https://viem.sh)) should work out-of-the-box with Etherlink.
* **Smart Rollup**: Smart Rollups are Tezos's permissionless L2 scaling solution. They are WASM applications, providing versatility in what language you write them in. They are optimistic and enshrined:
  * **Optimistic** means that when rollup operators publish a claim about the state of the rollup, the claim is trusted by default. Other operators can easily verify and challenge the claim, and a single honest operator is enough to ensure that the rollup is running honestly.
  * **Enshrined** means that they are implemented as a first-class operation at the protocol level within L1 Tezos, as opposed to using a smart contract on L1 like current Ethereum solutions.
* **Data availability on Tezos**: Smart Rollups store data on Tezos layer 1, making it available to everyone.

***

### How do I start building on Etherlink?

Great question. Start with this documentation and also join our [Discord](https://discord.gg/etherlink).
