---
title: '❓ What is Etherlink?'
---

Etherlink is an EVM-compatible rollup which has a _decentralised sequencer, low gas fees,_ and _fair ordering._&#x20;

* **Decentralised Sequencer 🌐:** using a state-of-the-art consensus mechanism, Etherlink's decentralised sequencer provides censorship resistance and MEV protection out-of-the-box.
* **Very Low Fees  💰 :** at a load of 200TPS, expect an ERC-20 transaction to cost $0.001 on Etherlink.
* **Fair Ordering ⚖️ :** with a distributed sequencer from day 1, MEV protection is built-in with fair transaction ordering for all users.

Etherlink uses the decentralised [Tezos](https://tezos.com) protocol for data availability (prior to an implementation of the [Data Availability Layer](https://spotlight.tezos.com/data-availability-layer-dal-what-is-it-all-about/)).

***

### What does that mean?

* **EVM compatible**: all Solidity/Vyper smart contracts can be deployed to Etherlink just like any other EVM chain. All your developer tooling ([Hardhat](https://hardhat.org/), [Foundry](https://book.getfoundry.sh/), [Viem](https://viem.sh)) should work out-of-the-box.&#x20;
* **Smart Rollup**: smart rollups are Tezos’ permissionless L2 scaling solution. They are WASM applications, providing versatility in what language you write them in. They are optimistic and enshrined:
  * _Optimistic_ means that when rollup operators publish a claim about the state of the rollup, the claim is trusted automatically. Innocent until proven guilty.
  * _Enshrined_ means they are implemented directly at the protocol level within L1 Tezos, as opposed to using a smart contract on L1 like current Ethereum solutions.
* **Data Availability on Tezos**: smart rollups store data they want available on the Tezos layer 1.

***

### Why is it better?

Etherlink is an [_enshrined_](https://research-development.nomadic-labs.com/smart-rollups-are-coming.html#enshrined-what) smart rollup which rolls up on the decentralised Tezos protocol. Therefore, Tezos validators are the only point of failure, not the sequencer.

Furthermore, being a smart rollup on Tezos gives Etherlink some unique advantages, for example quick time-to-L1 finality thanks to Tezos’ 2 block finality guarantee.

<table><thead><tr><th width="170">Chain</th><th width="141.33333333333331">Sequencer</th><th>L2 finality time</th><th>Data Posted on L1</th></tr></thead><tbody><tr><td>Etherlink</td><td>Decentralized</td><td>~ 750ms</td><td>~ 15 seconds</td></tr><tr><td>Optimism Bedrock</td><td>Centralized</td><td>~ <a href="https://community.optimism.io/docs/developers/build/differences/#blocks">2 seconds</a></td><td>~ <a href="https://optimistic.etherscan.io/batches">2 minutes</a></td></tr><tr><td>Arbitrum One</td><td>Centralized</td><td>~ <a href="https://arbiscan.io/">300ms</a></td><td>~ <a href="https://arbiscan.io/batches">7 minutes</a></td></tr></tbody></table>

***

### How do I start building on Etherlink?

Great question. Start with this documentation and also join our [Discord](https://discord.gg/etherlink).
