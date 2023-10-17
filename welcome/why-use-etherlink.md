---
description: The Advantages of Etherlink
---

# Why use Etherlink?

Etherlink builds on the decentralisation of L1 Tezos to provide an EVM-compatible solution with distributed sequencing from day 1.  Leveraging the latest research with a modified implementation of [Bullshark](https://arxiv.org/abs/2201.05677) with [Shoal](https://medium.com/aptoslabs/shoal-how-we-reduce-bullshark-latency-on-the-aptos-blockchain-44a600d977a1), Etherlink is low latency (\~500ms confirmation time) with a fair ordering of transactions for all. If the sequencing fails, users have an option to submit to the L1 directly after a delay.&#x20;

### Smart Rollup Advantages

All smart rollups on Tezos, Etherlink included, are optimistic and enshrined.  This means they are implemented directly at the Tezos’ protocol level as opposed to using a smart contract on L1 for their operation. Tezos’ smart rollups are officially recognised by the protocol as special entities with particular privileges and features, as oppose to a smart contract based rollup:

* Rollup related L1 activity can be made much more gas efficient
* Standardisation of communication between L1 and rollups allows for cross rollup communication, even those with different execution environments (e.g. EVM/Michelson/SVM etc)
* Smart Rollups can retrieve information from a “reveal-data channel” enabling access to data sources external to the Tezos blockchain.
