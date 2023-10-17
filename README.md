---
description: 1-page to get you up to speed
---

# Etherlink

Etherlink is an EVM-compatible smart rollup which prioritises _fair ordering of transactions_, _low latency_ and _security:_

* **Fair Ordering ⚖️ :** with a distributed sequencer from day 1, MEV protection is built-in with fair transaction ordering for all users.
* **Low Latency 🏎️ :** goal confirmation time of \~500ms.
* **Security 🔐 :** if sequencing fails, users have the option to submit directly to the L1 after a 24 hour delay.&#x20;

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

<table><thead><tr><th width="170">Chain</th><th width="141.33333333333331">Sequencer</th><th>L2 finality time</th><th>Data Posted on L1</th></tr></thead><tbody><tr><td>Etherlink</td><td>Distributed</td><td>~ 500ms</td><td>~ 30 seconds</td></tr><tr><td>Optimism Bedrock</td><td>Centralised</td><td>~ <a href="https://community.optimism.io/docs/developers/build/differences/#blocks">2 seconds</a></td><td>~ <a href="https://optimistic.etherscan.io/batches">2 minutes</a></td></tr><tr><td>Arbitrum One</td><td>Centralised</td><td>~ <a href="https://arbiscan.io/">300ms</a></td><td>~ <a href="https://arbiscan.io/batches">7 minutes</a></td></tr></tbody></table>

***

### How do I start building on Etherlink?

Great question. Start [here](broken-reference).\
